import CommandModel from '../../models/database/CommandModel';
import UsersModel from '../../models/database/UsersModel';
import * as sequelize from 'sequelize';

/**
* @class UsersController
* @classdesc The controller for the user information process.
*/
export default class UsersController extends CommandModel {
	public constructor(connection: any) {
		super();
		this.model = new UsersModel(connection).get();
	}

	/**
	* .
	* @method userJoin
	* @memberof UsersController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public userJoin(userID: string, userName: string, serverID: string, svrJoinDate: Date): Promise<void> {
		return this.model.upsert({ userID, userName, serverID, svrJoinDate });
	}

	/**
	* .
	* @method userPart
	* @memberof UsersController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public userPart(userID: string, userName: string, serverID: string, svrPartDate: Date): Promise<void> {
		return this.model.upsert({ userID, userName, serverID, svrPartDate });
	}
}
