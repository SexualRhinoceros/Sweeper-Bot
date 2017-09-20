import * as Sequelize from 'sequelize';
import BaseModel from './BaseModel';

export default class BanModel extends BaseModel {
	public constructor(connection: any) {
		super({
			serverid: {
				type: Sequelize.TEXT,
				field: 'ServerID',
				allowNull: false
			},
			modid: {
				type: Sequelize.TEXT,
				field: 'ModeratorID',
				allowNull: false
			},
			userid: {
				type: Sequelize.TEXT,
				field: 'UserID',
				allowNull: false
			},
			actiontype: {
				type: Sequelize.TEXT,
				field: 'ActionType',
				allowNull: false
			},
			actionlength: {
				type: Sequelize.TEXT,
				field: 'ActionLength',
				allowNull: true
			},
			note: {
				type: Sequelize.TEXT,
				field: 'Note',
				allowNull: false
			}
		}, 'ModActions', connection);
	}
}
