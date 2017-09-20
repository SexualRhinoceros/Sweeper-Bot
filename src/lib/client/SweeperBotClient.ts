import { Client, ListenerUtil } from 'yamdbf';
import DatabaseManager from '../managers/DatabaseManager';

const config: any = require('./config.json');
const { once } = ListenerUtil;

/**
* Sweeper Bot lives!!
* This is the heart of Sweeper Bot.
* @extends {external:Client}
*/
export class SweeperBotClient extends Client {
	/**
	* Variable, 'config'. Config file containing bot information.
	* @type {any}
	*/
	public config: any;

	/**
	* Variable, 'databaseManager'. Database connection information.
	* @type {DatabaseManager}
	*/
	public databaseManager: DatabaseManager;

	/**
	* Create the Sweeper Bot instance.
	* @constructor
	*/
	public constructor() {
		super({
			token: config.token,
			owner: config.owner,
			statusText: config.status,
			unknownCommandError: false,
			commandsDir: './commands',
			disableBase: [
				'clearlimit',
				'disablegroup',
				'enablegroup',
				'eval',
				'eval:ts',
				'limit',
				'listgroups',
				'ping',
				'reload'
			],
			readyText: 'Ready\u0007',
			ratelimit: '10/1m',
			pause: true
		});
		this.config = config;
		this.databaseManager = new DatabaseManager(config.DatabaseConnectionString);
	}

	@once('pause')
	private async _onPause(): Promise<void> {
		await this.setDefaultSetting('prefix', '.');
		this.emit('continue');
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void> {

	}

	@once('disconnect')
	private async _onDisconnect(): Promise<void> {
		process.exit(100);
	}
}
