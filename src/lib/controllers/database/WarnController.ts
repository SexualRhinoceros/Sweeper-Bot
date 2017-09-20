import CommandModel from '../../models/database/CommandModel';
import WarnModel from '../../models/database/WarnModel';
import * as sequelize from 'sequelize';

/**
* @class WarnController
* @classdesc The controller for the warning process.
*/
export default class WarnController extends CommandModel {
	public constructor(connection: any) {
		super();
		this.model = new WarnModel(connection).get();
	}

	/**
	* .
	* @method addWarn
	* @memberof WarnController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public addWarn(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Warn', note }
		);
	}
}
