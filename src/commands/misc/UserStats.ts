import { Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import Constants from '../../util/Constants';
import * as fuzzy from 'fuzzy';
import * as moment from 'moment';

export default class UserStats extends Command {
	public constructor() {
		super({
			name: 'us',
			desc: 'User Stats',
			usage: '<prefix>us <Argument>?',
			info: 'Argument information below...\u000d\u000d' +
			'@mention : Display user information via @mention\u000d' +
			'username : Display user information via display name\u000d\u000d' +
			'*Running the command without an argument returns your information.',
			group: 'misc',
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;
		let guildMember: GuildMember;
		let joinDiscord: string = '';
		let joinServer: string = '';
		let userRoles: Collection<string, Role>;
		let status: string = '';

		// grab user information
		// guildMember = message.member;
		if (!args[0]) {
			guildMember = message.member;
		} else {
			// if that attempt was a mention, get very first one
			if (message.mentions.users.size === 1) {
				guildMember = await message.guild.fetchMember(message.mentions.users.first().id);

			// if no mentions, plaintext
			} else {
				// Check if it's a user ID first
				if (idRegex.test(args[0])) {
					try { guildMember = await message.guild.fetchMember(args[0].match(idRegex)[0]); }
					catch (err) { return message.channel.send(`Could not locate user **${args[0]}** from ID argument.`); }
				}
			}
		} 

		if (!guildMember) {
			return message.channel.send(`No users found. Please specify a user by User Mention, or User ID.`);
		}

		// start typing
		message.channel.startTyping();

		joinDiscord = moment(guildMember.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.user.createdAt, 'days') + ' days ago*';
		joinServer = moment(guildMember.joinedAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.joinedAt, 'days') + ' days ago*';
		userRoles = new Collection(Array.from(guildMember.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
		status = guildMember.user.presence.status;

		// build user role array
		let roles: Array<Role> = userRoles.filter((el: Role) => { if (el.name !== '@everyone' && el.managed === false) return true; }).map((el: Role) => { return el; });
		let rolesString: string = '*none*';

		// make sure roles isn't empty
		if (roles.length > 0)
			rolesString = roles.join(', ');

		// update status string, based on original status
		if (status === 'online')
			status = 'Status: *Online*';
		if (status === 'offline')
			status = 'Status: *Offline*';
		if (status === 'idle')
			status = 'Status: *Idle*';
		if (status === 'dnd')
			status = 'Status: *Do Not Disturb*';

		// build the embed
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.embedColor)
			.setAuthor(`${guildMember.user.tag} (${guildMember.id})`, guildMember.user.avatarURL)
			.setDescription(status)
			.addField('Joined Server', joinServer, true)
			.addField('Joined Discord', joinDiscord, true)
			.addField('Roles', rolesString, false)
			.setTimestamp();

		// display stats
		message.channel.send({ embed: embed });
		return message.channel.stopTyping();
	}
}
