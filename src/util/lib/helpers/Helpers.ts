import { GuildMember, Guild, Message, RichEmbed, Role, User, TextChannel } from 'discord.js';
import { GuildStorage, Logger, logger } from 'yamdbf';
import { SweeperClient } from '../SweeperClient';
import Constants from '../../Constants';
import * as moment from 'moment';

export class Helpers
{
	@logger private readonly logger: Logger;
	private _client: SweeperClient;
	public constructor(client: SweeperClient)
	{
		this._client = client;
	}

	// Antispam - Discord Invite Links
	public async antispamDiscordInvites(message: Message, msgChannel: TextChannel): Promise<void>
	{
		if (message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.exists('id', Constants.antispamBypassId)) return;
		message.delete();
		const antispamType: string = 'Discord Invites Blacklisted';

		const regexMatch: string = Constants.discordInviteRegExp.exec(message.content)[0];
		this.logMessage(message, msgChannel, regexMatch, antispamType);

		await message.member.user.send(`You have been warned on **${message.guild.name}**.\n\n**A message from the mods:**\n\n"Discord invite links are not permitted."`)
			.then((res) => {
				// Inform in chat that the warn was success, wait a few sec then delete that success msg
				this._client.database.commands.warn.addWarn(message.guild.id, this._client.user.id, message.member.user.id, `Warned: ${antispamType}`);
				this.logger.log('Helpers Warn', `Warned user (${antispamType}): '${message.member.user.tag}' in '${message.guild.name}'`);
			})
			.catch((err) => {
				const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error informing ${message.member.user.tag} (${message.member.user.id}) of their warning (automatically). This user posted a **Discord Invite Link**. Their DMs may be disabled.\n\n**Error:**\n${err}`);
				this.logger.log('Helpers Warn', `Unable to warn user: '${message.member.user.tag}' in '${message.guild.name}'`);
				throw new Error(err);
			});
	}

	// Antispam - Mass Mentions
	public async antispamMassMentions(message: Message, msgChannel: TextChannel): Promise<void>
	{
		if (message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.exists('id', Constants.antispamBypassId)) return;
		message.delete();
		const antispamType: string = 'Mass Mention Spam';

		const regexMatch: string = '6+ mentions';
		this.logMessage(message, msgChannel, regexMatch, antispamType);

		await message.member.user.send(`You have been warned on **${message.guild.name}**.\n\n**A message from the mods:**\n\n"Do not spam mentions. This includes mentioning a lot of users at once."`)
			.then((res) => {
				this._client.database.commands.warn.addWarn(message.guild.id, this._client.user.id, message.member.user.id, `Warned: ${antispamType}`);
				this.logger.log('Helpers Warn', `Warned user (${antispamType}): '${message.member.user.tag}' in '${message.guild.name}'`);
			})
			.catch((err) => {
				const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error informing ${message.member.user.tag} (${message.member.user.id}) of their warning (automatically). This user **spammed mentions**. Their DMs may be disabled.\n\n**Error:**\n${err}`);
				this.logger.log('Helpers Warn', `Unable to warn user: '${message.member.user.tag}' in '${message.guild.name}'`);
				throw new Error(err);
			});
	}

	// Antispam - Twitch Links
	public async antispamTwitchLinks(message: Message, msgChannel: TextChannel): Promise<void>
	{
		if (message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.exists('id', Constants.antispamBypassId)) return;
		if (message.content.includes('twitch.tv/bungie') || message.content.includes('twitch.tv\\bungie' || message.content.includes('clips.twitch.tv'))) return;
		message.delete();
		const antispamType: string = 'Twitch Links Blacklisted';

		const regexMatch: string = Constants.twitchRegExp.exec(message.content)[0];
		this.logMessage(message, msgChannel, regexMatch, antispamType);

		await message.member.user.send(`You have been warned on **${message.guild.name}**.\n\n**A message from the mods:**\n\n"Do not post twitch links without mod approval."`)
			.then((res) => {
				this._client.database.commands.warn.addWarn(message.guild.id, this._client.user.id, message.member.user.id, `Warned: ${antispamType}`);
				this.logger.log('Helpers Warn', `Warned user (${antispamType}): '${message.member.user.tag}' in '${message.guild.name}'`);
			})
			.catch((err) => {
				const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error informing ${message.member.user.tag} (${message.member.user.id}) of their warning (automatically). This user **posted a twitch link**. Their DMs may be disabled.\n\n**Error:**\n${err}`);
				this.logger.log('Helpers Warn', `Unable to warn user: '${message.member.user.tag}' in '${message.guild.name}'`);
				throw new Error(err);
			});
	}

	// Logs message in channel
	public async logMessage(message: Message, msgChannel: TextChannel, regexMatch: string, reason: string): Promise<void>
	{
		const logChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.warnEmbedColor)
			.setAuthor(`${message.member.user.tag} (${message.member.id})`, message.member.user.avatarURL)
			.setDescription(`**Action:** Message Deleted\n`
				+ `**Reason:** ${reason}\n`
				+ `**Match:** ${regexMatch}\n`
				+ `**Channel:** #${msgChannel.name} (${message.channel.id})\n`
				+ `**Message:** (${message.id})\n\n`
				+ `${message.cleanContent}`)
			.setTimestamp();
		logChannel.send({ embed: embed });
		return;
	}

}
