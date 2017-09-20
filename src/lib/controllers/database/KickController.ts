import CommandModel from '../../models/database/CommandModel';
import KickModel from '../../models/database/KickModel';
import * as sequelize from 'sequelize';

/**
* @class KickController
* @classdesc The controller for the kicking process.
*/
export default class KickController extends CommandModel {
	private connection: any;

	public constructor(connection: any) {
		super();
		this.connection = connection;
		this.model = new KickModel(connection).get();
	}

	/**
	* Add a kick.
	* @method addKick
	* @memberof KickController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public addKick(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Kick', note }
		);
	}
}
