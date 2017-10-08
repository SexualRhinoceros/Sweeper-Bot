// Note: ModManager and and a few related aspects have come from https://github.com/zajrik/modbot

import { Command, GuildStorage, Logger, logger } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, TextChannel, User } from 'discord.js';
import Constants from '../../util/Constants';
import * as fuzzy from 'fuzzy';
import { SweeperClient } from '../../util/lib/SweeperClient';

import { prompt, PromptResult } from '../../util/lib/Util';

const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;

export default class Mute extends Command<SweeperClient> {
	@logger private readonly logger: Logger;

	public constructor() {
		super({
			name: 'membersSync',
			aliases: ['ms'],
			desc: 'Sync list of users in the server to the database.',
			usage: '<prefix>membersSync',
			group: 'admin',
			guildOnly: true,
			callerPermissions: ['ADMINISTRATOR']
		});
	}

	public async action(message: Message): Promise<any> {

		let embed: RichEmbed = new RichEmbed();
		embed.setDescription('If this is a large server, this will take a while and should **NOT** be done often.');
		// If message sent from a non-mod channel then show minimal info
		if (message.channel.id !== Constants.modChannelId) {
			// Delete calling message immediately
			message.delete();
		}

		const [result, ask, confirmation]: [PromptResult, Message, Message] = <[PromptResult, Message, Message]> await prompt(message,
			'Are you sure you want to initiate a member sync? (__y__es | __n__o)',
			/^(?:yes|y)$/i, /^(?:no|n)$/i, { embed });

		// If message sent from a non-mod channel then delete the mod messages
		if (ask.channel.id !== Constants.modChannelId) {
			// Delete the prompt messages
			ask.delete();
			confirmation.delete();
		}

		if (result === PromptResult.TIMEOUT) return message.channel.send('Command timed out, aborting action.');
		if (result === PromptResult.FAILURE) return message.channel.send('Okay, aborting action.');

		// If guild owner confirmed action
		try {
			await message.channel.send(`Attempting Member Sync to database...`);
			// Fetches all members including offline
			await message.guild.fetchMembers();
			// Adds to the database
			for (const member of message.guild.members.values()) {
				await this.client.mod.actions.userJoin(member, message.guild);
				this.logger.log('CMD membersSync', `Added ${member.user.tag} to server join logs.`);
				await new Promise((r: any) => setTimeout(r, 250));
			}
			return message.channel.send(`Member Sync has completed.`);

		} catch (err) {
			const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
			modChannel.send(`There was an error syncing the server members. Please try again.\n\n**Error:**\n${err}`);
			return this.logger.log('CMD membersSync', `Unable to sync members: Possible error logging to DB.`);
		}
	}
}
