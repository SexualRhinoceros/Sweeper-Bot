import { GuildStorage, ListenerUtil, Logger, logger } from 'yamdbf';
import { Collection, TextChannel, RichEmbed, Message, MessageReaction, Guild, GuildMember, Role, User, VoiceChannel } from 'discord.js';
import { SweeperClient } from '../SweeperClient';
import { MuteManager } from '../mod/managers/MuteManager';
import Constants from '../../Constants';
import * as moment from 'moment';

const config: any = require('../../../config.json');
const { on, registerListeners } = ListenerUtil;

export class Events {
	private _client: SweeperClient;
	@logger private readonly logger: Logger;

	public constructor(client: SweeperClient)
	{
		this._client = client;
		registerListeners(this._client, this);
	}

	@on('voiceStateUpdate')
	private async _onVoiceStateUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
		let emptyChannels: number = this._client.voiceChannelManager.getEmptyVoiceChannels(newMember.guild).size;
		let makeChannel: boolean = false;

		if (emptyChannels <= 2)
			makeChannel = true;

		if ((newMember.voiceChannel !== undefined && newMember.voiceChannelID !== null && newMember.voiceChannel.name.startsWith('Fireteam ')) && makeChannel)
			this._client.voiceChannelManager.createChannel(newMember);
	}

	@on('messageReactionAdd')
	private async _onReaction(reaction: MessageReaction, user: User): Promise<any> {
		if (user.id === this._client.user.id)
			return;

		// 296023718839451649 == @Charlemagne#3214
		// 294882584201003009 == @GiveawayBot#2381
		if (user.id === '296023718839451649' || user.id === '294882584201003009')
			return;

		if (user.bot)
			return reaction.remove(user);

		const reactionAuthor: GuildMember = await reaction.message.guild.fetchMember(user);
		let guildStorage: GuildStorage = await this._client.storage.guilds.get(reaction.message.guild.id);

		let platformMessageId: string = await guildStorage.get('Role Reaction Message');
		let spoilersMessageId: string = await guildStorage.get('Spoiler Reaction Message');
		let factionMessageId: string = await guildStorage.get('Faction Reaction Message');

		let roles: Array<Role> = new Array();

		// Platform
		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');
		// Spoilers Enabled
		roles[3] = reaction.message.guild.roles.find('name', 'Spoilers Enabled');
		// Factions
		roles[4] = reaction.message.guild.roles.find('name', 'Dead Orbit');
		roles[5] = reaction.message.guild.roles.find('name', 'Future War Cult');
		roles[6] = reaction.message.guild.roles.find('name', 'New Monarchy');

		// Platform Message
		if (reaction.message.id === platformMessageId) {
			switch (reaction.emoji.name) {
				case 'blizz':
					if (reactionAuthor.roles.has(roles[0].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[0]);

				case 'ps':
					if (reactionAuthor.roles.has(roles[1].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[1]);

				case 'xb':
					if (reactionAuthor.roles.has(roles[2].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[2]);
			}
		}

		// Spoiler Message
		if (reaction.message.id === spoilersMessageId) {
			switch (reaction.emoji.name) {
				case 'D2':
					if (reactionAuthor.roles.has(roles[3].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[3]);
			}
		}

		// Faction Wars Message
		if (reaction.message.id === factionMessageId) {
			switch (reaction.emoji.name) {
				case 'do':
					// If they already have the role, remove it so they can re-react to add it.
					if (reactionAuthor.roles.has(roles[4].id))
						reaction.remove(user);
					// Else if they don't have the role, give it to them.
					else
						await reactionAuthor.addRole(roles[4]);

					// If they have FWC or NM then remove those roles from them
					await reactionAuthor.removeRoles([roles[5], roles[6]]);
					// and also remove their reactions
					reaction.message.reactions.forEach(async (re: MessageReaction) => {
						await re.fetchUsers();
						if (re.emoji.name === 'do')
							return;
						await re.remove(user);
					});

					return;

				case 'fwc':
					// If they already have the role, remove it so they can re-react to add it.
					if (reactionAuthor.roles.has(roles[5].id))
						reaction.remove(user);
					// Else if they don't have the role, give it to them.
					else
						await reactionAuthor.addRole(roles[5]);

					// If they have DO or NM then remove those roles from them
					await reactionAuthor.removeRoles([roles[4], roles[6]]);
					// and also remove their reactions
					reaction.message.reactions.forEach(async (re: MessageReaction) => {
						await re.fetchUsers();
						if (re.emoji.name === 'fwc')
							return;
						await re.remove(user);
					});

					return;

				case 'nm':
					// If they already have the role, remove it so they can re-react to add it.
					if (reactionAuthor.roles.has(roles[6].id))
						reaction.remove(user);
					// Else if they don't have the role, give it to them.
					else
						await reactionAuthor.addRole(roles[6]);

					// If they have DO or FWC then remove those roles from them
					await reactionAuthor.removeRoles([roles[4], roles[5]]);
					// and also remove their reactions
					reaction.message.reactions.forEach(async (re: MessageReaction) => {
						await re.fetchUsers();
						if (re.emoji.name === 'nm')
							return;
						await re.remove(user);
					});

					return;
			}
		}
	}

	@on('messageReactionRemove')
	private async _onReactionRemove(reaction: MessageReaction, user: User): Promise<any> {
		const reactionAuthor: GuildMember = await reaction.message.guild.fetchMember(user);
		let guildStorage: GuildStorage = await this._client.storage.guilds.get(reaction.message.guild.id);

		let platformMessageId: string = await guildStorage.get('Role Reaction Message');
		let spoilersMessageId: string = await guildStorage.get('Spoiler Reaction Message');
		let factionMessageId: string = await guildStorage.get('Faction Reaction Message');

		let roles: Array<Role> = new Array();

		// Platform
		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');
		// Spoilers Enabled
		roles[3] = reaction.message.guild.roles.find('name', 'Spoilers Enabled');
		// Factions
		roles[4] = reaction.message.guild.roles.find('name', 'Dead Orbit');
		roles[5] = reaction.message.guild.roles.find('name', 'Future War Cult');
		roles[6] = reaction.message.guild.roles.find('name', 'New Monarchy');

		// Platform Message
		if (reaction.message.id === platformMessageId) {
			switch (reaction.emoji.name) {
				case 'blizz':
					return await reactionAuthor.removeRole(roles[0]);

				case 'ps':
					return await reactionAuthor.removeRole(roles[1]);

				case 'xb':
					return await reactionAuthor.removeRole(roles[2]);
			}
		}

		// Spoiler Message
		if (reaction.message.id === spoilersMessageId) {
			switch (reaction.emoji.name) {
				case 'D2':
					return await reactionAuthor.removeRole(roles[3]);
			}
		}

		// Faction Wars Message
		if (reaction.message.id === factionMessageId) {
			switch (reaction.emoji.name) {
				case 'do':
					return await reactionAuthor.removeRole(roles[4]);

				case 'fwc':
					return await reactionAuthor.removeRole(roles[5]);

				case 'nm':
					return await reactionAuthor.removeRole(roles[6]);
			}
		}
	}

	@on('guildMemberRemove')
	private async _onGuildMemberRemove(member: GuildMember, joined: boolean = false): Promise<void> {
		this.logMember(member, joined);
		this._client.mod.actions.userPart(member, member.guild);

		if (!await this._client.mod.managers.mute.isMuted(member)) return;

		const user: User = member.user;
		this._client.mod.managers.mute.setEvasionFlag(member);
	}

	@on('guildMemberAdd')
	private async _onGuildMemberAdd(member: GuildMember, joined: boolean = true): Promise<void> {
		this.logMember(member, joined);
		this._client.mod.actions.userJoin(member, member.guild);

		if (!await this._client.mod.managers.mute.isMuted(member)) return;
		if (!await this._client.mod.managers.mute.isEvasionFlagged(member)) return;

		const mutedRole: Role = member.guild.roles.find('name', 'Muted');
		await member.setRoles([mutedRole]);
		this._client.mod.managers.mute.clearEvasionFlag(member);
	}

	private logMember(member: GuildMember, joined: boolean): void
	{
		if (!member.guild.channels.exists('name', 'members-log')) return;
		const type: 'join' | 'leave' = joined ? 'join' : 'leave';
		const memberLog: TextChannel = <TextChannel> member.guild.channels.find('name', 'members-log');

		const joinDiscord: string = moment(member.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(member.user.createdAt, 'days') + ' days ago*';
		const joinServer: string = moment(member.joinedAt).format('lll') + '\n*' + moment(new Date()).diff(member.joinedAt, 'days') + ' days ago*';

		const embed: RichEmbed = new RichEmbed()
			.setColor(joined ? 8450847 : 16039746)
			.setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL)
			.addField('Joined Server', joinServer, true)
			.addField('Joined Discord', joinDiscord, true)
			.setFooter(joined ? 'User joined' : 'User left' , '')
			.setTimestamp();
		memberLog.send({ embed });
	}

	@on('message')
	private async onMessage(message: Message): Promise<void>
	{
		// Determines whether to remove and log Discord invite messages
		let userRoles: Collection<string, Role>;
		userRoles = new Collection(Array.from(message.member.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
		// build user role array
		let roles: Array<String> = userRoles.filter((el: Role) => { if (el.name !== '@everyone' && el.managed === false) return true; }).map((el: Role) => { return el.id; });

		// 157728857263308800 = The Vanguard && 302255737302679552 = Moderators && 297858394323419136 = Botwinder | PROD
		// 362039223588487178 = test | DEV
		if (roles.includes('362039223588487178') || roles.includes('157728857263308800') || roles.includes('302255737302679552') || roles.includes('297858394323419136')) {
			return;
		} else if (Constants.discordInviteRegExp.test(message.content)) {
			const logChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.logChannelId);
			const embed: RichEmbed = new RichEmbed()
				.setColor(Constants.warnEmbedColor)
				.setAuthor(message.member.user.tag, message.member.user.avatarURL)
				.setDescription(`**Action:** Message Deleted\n`
					+ `**Reason:** Discord Invites Blacklisted\n`
					+ `**Message:** ${message.content}`)
				.setTimestamp();
			logChannel.send({ embed: embed });

			await message.member.user.send(`You have been warned on **${message.guild.name}**.\n\n**A message from the mods:**\n\n"Discord invite links are not permitted."`)
				.then((res) => {
					// Inform in chat that the warn was success, wait a few sec then delete that success msg
					this.logger.log('Events Warn', `Warned user: '${message.member.user.tag}' in '${message.guild.name}'`);
				})
				.catch((err) => {
					const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
					modChannel.send(`There was an error informing ${message.member.user.tag} (${message.member.user.id}) of their warning (automatically). This user posted a **Discord Invite Link**. Their DMs may be disabled.\n\n**Error:**\n${err}`);
					this.logger.log('Events Warn', `Unable to warn user: '${message.member.user.tag}' in '${message.guild.name}'`);
					throw new Error(err);
				});
			message.delete();
		}
	}
}
