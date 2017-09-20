import CommandController from '../controllers/database/CommandController';
import ObserverModel from '../models/database/ObserverModel';
import * as Sequelize from 'sequelize';

let instance: DatabaseManager = undefined;

export default class DatabaseManager extends ObserverModel {
	public user: string;
	public password: string;
	public host: string;
	public port: number;
	public database: string;
	public logging: Function;
	private connection: any;

	public commands: CommandController;

	public constructor(credentials: any, logging: boolean = false) {
		super();
		if (!instance) {
			instance = this;
		} else {
			return instance;
		}

		this.user = credentials.user;
		this.password = credentials.password;
		this.host = credentials.host;
		this.port = credentials.port;
		this.database = credentials.database;
		this.logging = logging ? console.log : function() {};

		this.connect()
			.then(() => {
				this.commands = new CommandController(this.connection);
				this.emit('connected');
			})
			.catch((error) => {
				console.error(error);
			});

		return instance;
	}

	private connect(): Promise<any> {
		this.connection = new Sequelize(this.database, this.user, this.password, {
			host: this.host,
			port: this.port,
			dialect: 'postgres',
			logging: this.logging,
			pool: {
				max: 10,
				min: 1,
				idle: 10000
			},
			dialectOptions: {
				keepAlive: true
			}
		});

		return this.connection.authenticate();
	}
}
