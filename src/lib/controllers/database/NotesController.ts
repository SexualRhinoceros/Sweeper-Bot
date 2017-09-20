import CommandModel from '../../models/database/CommandModel';
import NotesModel from '../../models/database/NotesModel';
import * as sequelize from 'sequelize';

/**
* @class NotesController
* @classdesc The controller for the notes process.
*/
export default class NotesController extends CommandModel {
	public constructor(connection: any) {
		super();
		this.model = new NotesModel(connection).get();
	}

	/**
	* .
	* @method createNote
	* @memberof NotesController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public createNote(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, note }
		);
	}

	/**
	* .
	* @method getNote
	* @memberof NotesController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public getNote(serverid: string, userid: string): Promise<any> {
		return this.model.findAll({
			order: [[sequelize.col('id'), 'DESC']],
			where: { serverid, userid, actiontype: 'Note' },
			limit: 5,
			raw: true
		});
	}

	/**
	* .
	* @method getOneNote
	* @memberof NotesController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public getOneNote(noteid: number, serverid: string, userid: string): Promise<any> {
		return this.model.findAll({
			where: { id: noteid, serverid, userid, actiontype: 'Note' }
		});
	}

	/**
	* .
	* @method updateNote
	* @memberof NotesController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public updateNote(noteid: number, serverid: string, userid: string, note: string): Promise<any> {
		return this.model.update(
			{ note: note },
			{ where: { id: noteid, serverid, userid } }
		);
	}

	/**
	* .
	* @method deleteNote
	* @memberof NotesController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public deleteNote(id: number, serverid: string, userid: string): Promise<any> {
		return this.model.destroy({
			where: { id, serverid, userid }
		});
	}

	/**
	* .
	* @method resetNote
	* @memberof NotesController
	* @param {external:String} serverid - .
	* @param {external:String} modid - .
	* @param {external:String} userid - .
	* @param {external:String} note - .
	* @return {external:Promise<any>} .
	*/
	public resetNote(serverid: string, userid: string): Promise<any> {
		return this.model.destroy({
			where: { serverid, userid }
		});
	}
}
