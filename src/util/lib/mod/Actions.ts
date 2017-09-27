import { GuildMember, Guild, RichEmbed, User, TextChannel } from 'discord.js';
import { GuildStorage, Logger, logger } from 'yamdbf';
import { SweeperClient } from '../SweeperClient';
import Constants from '../../Constants';
import * as moment from 'moment';

/**
 * Contains methods for taking moderation action
 */
export class Actions
{
	@logger private readonly logger: Logger;
	private _client: SweeperClient;
	public constructor(client: SweeperClient)
	{
		this._client = client;
	}

	// Mute Actions
	// Mute a user in a guild
	public async mute(gmUser: GuildMember, issuer: GuildMember, guild: Guild, actionlength: string, note: string): Promise<void>
	{
		const storage: GuildStorage = this._client.storage.guilds.get(guild.id);
		await gmUser.addRoles([guild.roles.get(await storage.settings.get('mutedrole'))])
			.then(result => {
				this.logger.log('Actions', `Mute - Added role to '${gmUser.user.tag}' in '${guild.name}.`);

				this._client.mod.managers.mute.set(gmUser);
				this._client.database.commands.mute.addMute(guild.id, issuer.id, gmUser.id, actionlength, note);

				const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
				const embed: RichEmbed = new RichEmbed()
					.setColor(Constants.muteEmbedColor)
					.setAuthor(issuer.user.tag, issuer.user.avatarURL)
					.setDescription(`**Member:** ${gmUser.user.tag} (${gmUser.user.id})\n`
						+ `**Action:** Mute\n`
						+ `**Length:** ${actionlength}\n`
						+ `**Reason:** ${note}`)
					.setTimestamp();
				logChannel.send({ embed: embed });
			})
			.catch(error => {
				console.error(error);
				const modChannel: TextChannel = <TextChannel> guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error muting <@${gmUser.user.id}>. They may have the muted role but likely not informed of the mute or the action logged.`);
				this.logger.error('Actions', `Error adding mute role: '${gmUser.user.tag}' in '${guild.name}'`);
				throw new Error('There was an error muting the user');
			});
		return;
	}

	// Restart a mute, setting a new duration and timestamp
	public async setMuteDuration(member: GuildMember, guild: Guild, duration: int): Promise<void>
	{
		const user: User = member.user;
		await this._client.mod.managers.mute.set(member, duration);
		this.logger.log('Actions', `Updated mute: '${user.tag}' in '${guild.name}. Duration: ${duration}ms'`);
	}

	// Unmute a user in a guild
	public async unmute(gmUser: GuildMember, issuer: GuildMember, guild: Guild): Promise<GuildMember>
	{
		const storage: GuildStorage = this._client.storage.guilds.get(guild.id);
		const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.muteEmbedColor)
			.setAuthor(issuer.user.tag, issuer.user.avatarURL)
			.setDescription(`**Member:** ${gmUser.user.tag} (${gmUser.user.id})\n`
				+ `**Action:** Unmute`)
			.setTimestamp();
		logChannel.send({ embed: embed });

		return await gmUser.removeRole(guild.roles.get(await storage.settings.get('mutedrole')));
	}

	// Kick Actions
	// Kick a user from a guild
	public async kick(gmUser: GuildMember, moderator: GuildMember, guild: Guild, note: string): Promise<GuildMember>
	{
		const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.kickEmbedColor)
			.setAuthor(moderator.user.tag, moderator.user.avatarURL)
			.setDescription(`**Member:** ${gmUser.user.tag} (${gmUser.user.id})\n`
				+ `**Action:** Kick\n`
				+ `**Reason:** ${note}`)
			.setTimestamp();
		logChannel.send({ embed: embed });

		this._client.database.commands.ban.addKick(guild.id, moderator.id, gmUser.user.id, note);

		return await gmUser.kick(note);
	}

	// Ban Actions
	// Ban a user from a guild
	public async ban(user: User, moderator: GuildMember, guild: Guild, actionlength: string, note: string): Promise<GuildMember>
	{
		const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.banEmbedColor)
			.setAuthor(moderator.user.tag, moderator.user.avatarURL)
			.setDescription(`**Member:** ${user.tag} (${user.id})\n`
				+ `**Action:** Ban\n`
				+ `**Reason:** ${note}`)
			.setTimestamp();
		logChannel.send({ embed: embed });

		this._client.database.commands.ban.addBan(guild.id, moderator.id, user.id, actionlength, note);

		return <GuildMember> await guild.ban(user, { reason: note, days: 7 });
	}

	// Unban a user from a guild. Requires knowledge of the user's ID
	public async unban(user: User, moderator: GuildMember, guild: Guild, note: string): Promise<User>
	{
		const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.warnEmbedColor)
			.setAuthor(moderator.user.tag, moderator.user.avatarURL)
			.setDescription(`**Member:** ${user.tag} (${user.id})\n`
				+ `**Action:** Unban\n`
				+ `**Reason:** ${note}`)
			.setTimestamp();
		logChannel.send({ embed: embed });

		this._client.database.commands.ban.removeBan(guild.id, moderator.id, user.id, note);

		return await guild.unban(user.id);
	}

	// Softban a user from a guild, removing the past 7 days of their messages
	public async softban(user: User, guild: Guild, reason: string): Promise<User>
	{
		await guild.ban(user, { reason: `Softban: ${reason}`, days: 7 });
		await new Promise((r: any) => setTimeout(r, 5e3));
		return await guild.unban(user.id);
	}

	// Warn a user
	public async warn(gmUser: GuildMember, moderator: GuildMember, guild: Guild, note: string): Promise<void>
	{
		const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.warnEmbedColor)
			.setAuthor(moderator.user.tag, moderator.user.avatarURL)
			.setDescription(`**Member:** ${gmUser.user.tag} (${gmUser.user.id})\n`
				+ `**Action:** Warn\n`
				+ `**Reason:** ${note}`)
			.setTimestamp();
		logChannel.send({ embed: embed });

		return this._client.database.commands.warn.addWarn(guild.id, moderator.id, gmUser.id, note);
	}

	// Get History
	public async getHistory(user: User, guild: Guild): Promise<any>
	{
		return this._client.database.commands.ban.getHistory(guild.id, user.id)
			.then(results => {
				let embed: RichEmbed = new RichEmbed();
				// Set header info like the users name and ID along with the separater for the History Records
				// When all done, will look like this: https://i.imgur.com/yuodYuO.png
				embed.setAuthor(`Member: ${user.tag} (${user.id})`, user.avatarURL);
				embed.addField(`--------------`, `__**History Record:**__`, false);

				// Add the History data
				if (!results.length) {
					embed.addField(`History Data:`, `None`, false);
				} else {
					results.forEach((value: any, index: number) => {
						let noteDate: string = moment(value.createdAt).format('lll');
						let noteText = value.note;
						let length = 148;
						let trimmedNote = noteText.length > length ?
											noteText.substring(0, length - 3) + '...' :
											noteText;
						noteDate = moment(value.createdAt).format('lll');
						embed.addField(`[${value.actiontype}] ${value.id} - ${noteDate}`, `"${value.note}" - <@${value.modid}>`, false);
					});
				}

				// Set the footer spacer. Since the field can't be blank using spacer emoji.
				embed.addField(`--------------`, `${Constants.spacerEmoji}`, false);

				// Add the final ending field with the history count
				return this.getHistoryCount(user, guild)
					.then(function(result) {
						embed.addField('This user has: ', result);
						return embed;
					})
					.catch(error => {
						this.logger.error('Actions', `Unable to get history count. Error: ${error}`);
					});

			})
			.catch(error => {
				return console.error(error);
			});
	}

	// Get History Count
	public async getHistoryCount(user: User, guild: Guild): Promise<string>
	{
		let offensesData: any = await this._client.database.commands.ban.getHistoryCount(guild.id, user.id);
		let offenses: string = 'Data: ';
		for (let i in offensesData) {
			offenses = offenses.concat(', ', `${offensesData[i].Type}: ${offensesData[i].Count}`);
		}
		offenses = offenses.replace('Data: , ', '');
		return offenses;
	}

	// User Commands
	// User Joins Server
	public async userJoin(gmUser: GuildMember, guild: Guild): Promise<any>
	{
		let dateJoined = new Date(gmUser.joinedAt);
		return await this._client.database.commands.users.userJoin(gmUser.user.id, gmUser.user.tag, guild.id, dateJoined)
			.then(function(result) {
				return;
			})
			.catch(error => {
				// Known error with PG version: https://github.com/sequelize/sequelize/issues/8043
				// "TypeError: Cannot read property '0' of undefined"
				this.logger.error('Users', `Error setting userJoin. Known error. Error: ${error}`);
			});
	}

	// User Parts Server
	public async userPart(gmUser: GuildMember, guild: Guild): Promise<any>
	{
		let dateParted = new Date();
		return this._client.database.commands.users.userPart(gmUser.user.id, gmUser.user.tag, guild.id, dateParted)
			.then(function(result) {
				return;
			})
			.catch(error => {
				// Known error with PG version: https://github.com/sequelize/sequelize/issues/8043
				// "TypeError: Cannot read property '0' of undefined"
				this.logger.error('Users', `Error setting userPart. Known error. Error: ${error}`);
			});
	}
}
