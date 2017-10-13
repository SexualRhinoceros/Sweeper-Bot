import { Collection, Guild, Message, RichEmbed, TextChannel } from 'discord.js';
import { GuildStorage, ListenerUtil } from 'yamdbf';
import { SweeperClient } from '../SweeperClient';
import * as Schedule from 'node-schedule';
import * as WebRequest from 'web-request';
import Constants from '../../Constants';

const { on, registerListeners } = ListenerUtil;

export class VendorEngramManager {
	private client: SweeperClient;

	public constructor(client: SweeperClient) {
		this.client = client;
		registerListeners(this.client, this);
	}

	public async init(): Promise<void> {
		const channel: TextChannel = <TextChannel> this.client.channels.get(Constants.destiny2ChanId);

		if (channel) {
			try {
				let _this: VendorEngramManager = this;

				await Schedule.scheduleJob('5 * * * *', async function() {
					await _this.getVendorData(channel);
				});

				await Schedule.scheduleJob('35 * * * *', async function() {
					await _this.getVendorData(channel);
				});
			}
			catch (err) { console.log(`Could not schedule vendor API cron job`); }
		}
		else
			console.log(`Could not locate channel.`);

	}

	public async getVendorData(channel: TextChannel): Promise<void> {
		try {
			var vendorData = await WebRequest.json<any>(Constants.vendorEngramsAPIBase + Constants.vendorEngramsAPIKey);
			for (var vendor of vendorData) {
				if (vendor.type === 3 && vendor.verified === 1)
				{
					const vendorName: string = Constants.vendorEngramsVendors[vendor.vendor].name;
					const vendorLocation: string = Constants.vendorEngramsVendors[vendor.vendor].location;
					channel.send(`The following gear is likely available at 300 Power Level (for next ~25 minutes):\n\n`
								+ `**POTENTIAL GEAR:** ${vendorName}\n`
								+ `**LOCATION:** ${vendorLocation}\n\n`
								+ `Data provided by: <https://VendorEngrams.xyz>`);
				}
			}
			return;
		}
		catch (err) { return; }
	}
}
