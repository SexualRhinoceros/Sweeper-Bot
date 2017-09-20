import CommandModel from '../../models/database/CommandModel';
import MuteModel from '../../models/database/MuteModel';
import * as sequelize from 'sequelize';

/**
* @class MuteController
* @classdesc The controller for the muting process.
*/
export default class MuteController extends CommandModel {
	public constructor(connection: any) {
		super();
		this.model = new MuteModel(connection).get();
	}

	/**
	* Add a mute.
	* @method addMute
	* @memberof MuteController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public addMute(serverid: string, modid: string, userid: string, actionlength: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Mute', actionlength, note }
		);
	}
}
