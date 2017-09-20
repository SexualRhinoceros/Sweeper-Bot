import * as Sequelize from 'sequelize';
import BaseModel from './BaseModel';

export default class UsersModel extends BaseModel {
	public constructor(connection: any) {
		super({
			userID: {
				type: Sequelize.TEXT,
				field: 'UserID',
				allowNull: false,
				primaryKey: true
			},
			userName: {
				type: Sequelize.TEXT,
				field: 'UserName',
				allowNull: false
			},
			serverID: {
				type: Sequelize.TEXT,
				field: 'ServerID',
				allowNull: false
			},
			svrJoinDate: {
				type: Sequelize.DATE,
				field: 'SvrJoinDate',
				allowNull: true
			},
			svrPartDate: {
				type: Sequelize.DATE,
				field: 'SvrPartDate',
				allowNull: true
			}
		}, 'Users', connection);
	}
}
