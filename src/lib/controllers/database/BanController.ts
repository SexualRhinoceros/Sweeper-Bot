import CommandModel from '../../models/database/CommandModel';
import BanModel from '../../models/database/BanModel';
import * as sequelize from 'sequelize';

/**
* @class BanController
* @classdesc The controller for the banning process.
*/
export default class BanController extends CommandModel {
	private connection: any;

	public constructor(connection: any) {
		super();
		this.connection = connection;
		this.model = new BanModel(connection).get();
	}

	/**
	* Add a ban.
	* @method addBan
	* @memberof BanController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} actionlength - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public addBan(serverid: string, modid: string, userid: string, actionlength: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Ban', actionlength, note }
		);
	}

	/**
	* .
	* @method removeBan
	* @memberof BanController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public removeBan(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Unban', note }
		);
	}

	/**
	* .
	* @method getHistory
	* @memberof BanController
	* @param {external:String} serverid - .
	* @param {external:String} userid - .
	* @param {external:String} limit - .
	* @return {external:Promise<any>} .
	*/
	public getHistory(serverid: string, userid: string, limit: number = 5): Promise<any> {
		return this.model.findAll({
			order: [[sequelize.col('id'), 'DESC']],
			where: { serverid, userid },
			limit: limit,
			raw: true
		});
	}

	/**
	* .
	* @method getHistoryCount
	* @memberof BanController
	* @param {external:String} serverid - .
	* @param {external:String} userid - .
	* @return {external:Promise<any>} .
	*/
	public getHistoryCount(serverid: string, userid: string): Promise<any> {
		return this.connection.query('SELECT \"ActionType\" as \"Type\", count(\"ActionType\") as \"Count\" FROM \"ModActions\" WHERE \"ServerID\" = :sid AND \"UserID\" = :uid GROUP BY \"Type\"',
			{ replacements: { sid: serverid, uid: userid }, type: sequelize.QueryTypes.SELECT });
	}
}
