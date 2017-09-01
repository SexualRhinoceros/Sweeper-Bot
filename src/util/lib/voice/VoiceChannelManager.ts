import { Collection, Guild, GuildChannel, GuildMember, VoiceChannel } from 'discord.js';
import { GuildStorage, ListenerUtil, Logger, logger } from 'yamdbf';
import { SweeperClient } from '../SweeperClient';
import Constants from '../../Constants';
import * as Schedule from 'node-schedule';

export default class VoiceChannelManager {
	@logger
	private readonly logger: Logger;

	private client: SweeperClient;

	public constructor(client: SweeperClient) {
		this.client = client;
	}

	public async init(): Promise<void> {
		let _this: VoiceChannelManager = this;
		const guild: Guild = <Guild> this.client.guilds.get(Constants.serverId);

		await _this.curateChannels(guild);

		await Schedule.scheduleJob('*/1 * * * *', async function() {
			await _this.curateChannels(guild);
		});

		this.logger.log('VoiceChannelManager', `Curation Task Started.`);
	}

	public async curateChannels(guild: Guild): Promise<void> {
		let emptyChannels: Array<VoiceChannel> = this.getEmptyVoiceChannels(guild).map((channel: VoiceChannel) => { return channel; });
		let channelsForDeletion: Array<VoiceChannel> = this.getChannelsForDeletion(guild).map((channel: VoiceChannel) => { return channel; });

		for (let x: number = 0; x < channelsForDeletion.length; x++) {
			if (emptyChannels.length > 3) {
				await channelsForDeletion[x].delete();
				this.logger.log('VoiceChannelManager', `Deleted Voice Channel: ${channelsForDeletion[x].name}.`);
			}
		}
	}

	public async createChannel(member: GuildMember): Promise<void> {
		let baseChannelOne: VoiceChannel = member.guild.channels.find('id', Constants.baseVoiceChannelIdOne) as VoiceChannel;
		let channelName: string = this.getChannelName();
		let currentChannelNames: Array<string> = this.getCurrentChannelNames(member.guild);
		let fireTeamSize: number = 6;

		do { channelName = this.getChannelName(); }
		while (currentChannelNames.indexOf(channelName) !== -1);

		let newChannel: VoiceChannel = await baseChannelOne.clone(channelName, true, true) as VoiceChannel;

		await newChannel.setPosition(0);
		await newChannel.setUserLimit(fireTeamSize);

		this.logger.log('VoiceChannelManager', `Created Voice Channel: ${channelName}.`);
	}

	public getChannelsForDeletion(guild: Guild): Collection<string, GuildChannel> {
		return guild.channels.filter((channel: VoiceChannel, key: string, collection: Collection<string, VoiceChannel>) => {
			return (
				channel.type === 'voice' &&
				channel.members.size === 0 &&
				channel.name.startsWith('Fireteam ') &&
				channel.id !== Constants.baseVoiceChannelIdOne &&
				channel.id !== Constants.baseVoiceChannelIdTwo &&
				channel.id !== Constants.baseVoiceChannelIdThree) ? true : false;
		});
	}

	public getEmptyVoiceChannels(guild: Guild): Collection<string, GuildChannel> {
		return guild.channels.filter((channel: VoiceChannel, key: string, collection: Collection<string, VoiceChannel>) => {
			return (
				channel.type === 'voice' &&
				channel.members.size === 0 &&
				channel.name.startsWith('Fireteam ')) ? true : false;
		});
	}

	public getUsedChannelsCount(guild: Guild): number {
		return guild.channels.filter((channel: VoiceChannel, key: string, collection: Collection<string, VoiceChannel>) => {
			return ((channel.type === 'voice' && channel.name.startsWith('Fireteam ')) && channel.members.size !== 0) ? true : false;
		}).size;
	}

	public getCurrentChannelNames(guild: Guild): Array<string> {
		let voiceChannels: Collection<string, GuildChannel> = guild.channels.filter((channel: GuildChannel, key: string, collection: Collection<string, GuildChannel>) => {
			return (channel.type === 'voice' && channel.name.startsWith('Fireteam ')) ? true : false;
		});

		return voiceChannels.map((channel: GuildChannel) => channel.name);
	}

	public getChannelName(): string {
		return 'Fireteam ' + Constants.channelNames[Math.floor(Math.random() * Constants.channelNames.length)];
	}
}
