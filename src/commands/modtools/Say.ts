import { Command, GuildStorage, Time, Logger, logger, Message } from 'yamdbf';
import { GuildMember, RichEmbed, Role, TextChannel, User } from 'discord.js';
import Constants from '../../util/Constants';
import * as fuzzy from 'fuzzy';
import { SweeperClient } from '../../util/lib/SweeperClient';

const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;

export default class Mute extends Command<SweeperClient> {
	@logger private readonly logger: Logger;

	public constructor() {
		super({
			name: 'say',
			desc: 'Send a message as the bot in same channel.',
			usage: '<prefix>say <Message>?',
			group: 'modtools',
			guildOnly: true,
			callerPermissions: ['MANAGE_GUILD']
		});
	}

	public async action(message: Message, args: Array<any>): Promise<any> {

		if (args[0]) {
			// Set note info
			let messageData: string = '';
			messageData = this.parseNote(args);
			if (messageData.length === 0) {
				return message.channel.send('Please provide a message to send.');
			}

			try {
				message.channel.send(`${messageData}`);
				message.delete();
			} catch (err) {
				const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error using the **say** command.\n\n**Error:**\n${err}`);
				this.logger.log('CMD Say', `Unable to use SAY command to send message in: '${message.guild.name}' **Error:**\n${err}`);
				return;
			}

		} else {
			return message.channel.send('Please provide a message to say.');
		}
	}

	private parseNote(args: Array<any>): string {
		let text: string = '';
		for (let index: number = 0; index < args.length; index++) {
			text += `${args[index].trim()} `;
		}
		return text.slice(0, -1);
	}
}
