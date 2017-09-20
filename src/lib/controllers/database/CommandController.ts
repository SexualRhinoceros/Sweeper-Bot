import BanController from '../../controllers/database/BanController';
import MuteController from '../../controllers/database/MuteController';
import NotesController from '../../controllers/database/NotesController';
import UsersController from '../../controllers/database/UsersController';
import WarnController from '../../controllers/database/WarnController';

export default class CommandController {
	public readonly ban: BanController;
	public readonly mute: MuteController;
	public readonly note: NotesController;
	public readonly users: UsersController;
	public readonly warn: WarnController;

	public constructor(connection: any) {
		this.ban = new BanController(connection);
		this.mute = new MuteController(connection);
		this.note = new NotesController(connection);
		this.users = new UsersController(connection);
		this.warn = new WarnController(connection);
	}
}