const config: any = require('../config.json');
const vendors: any = require('../vendors.json');

export type BotConstants = {
	// ID
	assignmentChannelId: string;
	serverId: string;
	modChannelId: string;
	logChannelId: string;
	botDMServerId: string;
	destiny2ChanId: string;
	baseVoiceChannelIdOne: string;
	baseVoiceChannelIdTwo: string;
	baseVoiceChannelIdThree: string;
	whitelistedChannels: Array<string>;
	antispamBypassId: string;

	// API Data
	vendorEngramsAPIBase: string;
	vendorEngramsAPIKey: string;
	vendorEngramsVendors: any;

	// RegExp
	platformRegExp: RegExp;
	pcRegExp: RegExp;
	psRegExp: RegExp;
	xbRegExp: RegExp;
	discordInviteRegExp: RegExp;
	twitchRegExp: RegExp;

	// Embed color
	embedColor: string;
	muteEmbedColor: string;
	warnEmbedColor: string;
	banEmbedColor: string;
	kickEmbedColor: string;

	// Misc emoji
	spacerEmoji: string;
	sweeperbot: string;
	// Platforms
	blizzEmjoi: string;
	psEmoji: string;
	xbEmoji: string;
	removeEmoji: string;
	// Spoiler Channel access
	D2Emoji: string;
	// Faction Wars
	DOEmoji: string;
	FWCEmoji: string;
	NMEmoji: string;

	serverInvite: string;
	appealsServer: string;

	channelNames: Array<string>;
	footer: string;
};

// tslint:disable-next-line:variable-name
const Constants: BotConstants = <any> {};

// IDs
Constants.assignmentChannelId = config.ServerData.assignmentChannelId;
Constants.serverId = config.ServerData.serverId;
Constants.modChannelId = config.ServerData.modChannelId;
Constants.logChannelId = config.ServerData.logChannelId;
Constants.botDMServerId = config.ServerData.botDMServerId;
Constants.destiny2ChanId = config.ServerData.destiny2ChanId;
Constants.baseVoiceChannelIdOne = config.ServerData.baseVoiceChannelIdOne;
Constants.baseVoiceChannelIdTwo = config.ServerData.baseVoiceChannelIdTwo;
Constants.baseVoiceChannelIdThree = config.ServerData.baseVoiceChannelIdThree;
Constants.whitelistedChannels = ['255099898897104908', '323564629139652619', '361987348705312788', '322490463770640385',
								'342111927788634114', '297866918839451651', '322492361861103616', '332354014903664641',
								'368940297876668427', '369952267975000081', '360193326365933599', '370065490065883137'];
Constants.antispamBypassId = config.ServerData.antispamBypassId;

// API Data
Constants.vendorEngramsAPIBase = 'https://api.vendorengrams.xyz/getVendorDrops?key=';
Constants.vendorEngramsAPIKey = config.APIKeys.VendorEngramsXYZ;
Constants.vendorEngramsVendors = vendors;

// RegExp
Constants.platformRegExp = new RegExp('(\\bpc\\b)|(\\bpsn\\b)|(\\bps\\b)|(\\bxbl\\b)|(\\bxb\\b)|(\\bxbox\\b)', 'i');
Constants.pcRegExp = new RegExp('([A-Za-z0-9\-\_\#]{3,16})', 'i');
Constants.psRegExp = new RegExp('([A-Za-z0-9\-\_]{3,16})', 'i');
Constants.xbRegExp = new RegExp('(?:.me\\sset\\sxb|.me\\sset\\sxbl|.me\\sset\\sxbox)\\s([A-Za-z0-9\-\_\\s]{1,15})', 'i');
Constants.discordInviteRegExp = new RegExp(/discord(?:app\.com|\.gg|\.me)\/(?:invite\/)?(?![a-zA-Z0-9\-]+\/\w)(?:[a-zA-Z0-9\-]+)/, 'i');
Constants.twitchRegExp = new RegExp(/twitch\.tv(\\|\/).+/, 'i');

// Embed color
Constants.embedColor = '0xFF8C00';
Constants.muteEmbedColor = '0xFFCC00';
Constants.warnEmbedColor = '0xFFEF00';
Constants.banEmbedColor = '0xE50000';
Constants.kickEmbedColor = '0x0083FF';

// Misc emoji
Constants.spacerEmoji = '<:spacer:328352361569583105>';
Constants.sweeperbot = '<:sweeperbot:361145141173682177>';
// Platforms
Constants.blizzEmjoi = '<:blizz:328322843227979778>';
Constants.psEmoji = '<:ps:328322843198881792>';
Constants.xbEmoji = '<:xb:328322843798405133>';
// Spoiler Channel access
Constants.D2Emoji = '<:D2:336634217712582656>';
// Faction Wars emojis
Constants.DOEmoji = '<:do:247889245333618688>';
Constants.FWCEmoji = '<:fwc:247889245337944064>';
Constants.NMEmoji = '<:nm:247889245421699082>';

Constants.serverInvite = 'https://discord.gg/DestinyReddit';
Constants.appealsServer = 'https://discord.gg/r9w8EfP';
Constants.channelNames = ['Adonna', 'Agah', 'Agema', 'Aiat', 'Aksor', 'Alak-Hul', 'Alzok', 'Amanda Holliday', 'Amytis', 'Murmur',
	'Ana Bray', 'Andal', 'Arach Jalaal', 'Aral', 'Arath', 'ArchonSlayer', 'Ascendant Raisins', 'Aurash', 'Auryx', 'Azzir', 'Baby Dog',
	'Bamberga', 'Baxx', 'Bekhterev', 'Beltrik', 'Bracus', 'Bracuses', 'Brask', 'Brevin', 'Brother Vance', 'Bryl', 'Caedometric',
	'Calus', 'Carybdis', 'Celery', 'Charlemagne', 'Chioma', 'Chiomas', 'Citan', 'Colovance', 'Cozmo-23', 'Cryptarch', 'Crytparch',
	'Dakaua', 'Darkblade', 'Deathsinger', 'DeeJ', 'Dictata', 'Dinklebot', 'Draksis', 'Dredgen', 'Dredgen Yor', 'Drevis', 'Droysen',
	'DuaneMcniadh', 'Eliksni', 'Eriana', 'Eriana-3', 'Eris', 'Eris Morn', 'Eva Levante', 'Everis', 'Exo', 'Exo Stranger ', 'Feizel',
	'Felwinter', 'Fenchurch', 'Finnala', 'Gensym', 'Ghaul', 'Ghost', 'Gilmanovich', 'Gjallarhorn', 'GodWave', 'Golgoroth', 'Gornuk',
	'Gravekeeper', 'Grayor', 'Gulrot', 'Halak', 'Hassa', 'Hawkmoon', 'Hawthorne', 'Hezen', 'Hildean', 'Hildian', 'Hildians', 'Hohmann',
	'Holborn', 'Holliday', 'HopeEater', 'Hygiea', 'Illyn', 'Irxis', 'Ivonovich', 'Jagi', 'Jalaal', 'Jaren', 'Jaren Ward', 'Jolyon',
	'Jovians', 'Kadi 55-30', 'Kagoor', 'Kaharn', 'Kaliks', 'Keksis', 'Kells', 'Kellship', 'Khvostov', 'Korus', 'Kovik', 'Kraghoor',
	'Kranox', 'Kressler', 'Krughor', 'Lakpha', 'Lakshmi-2', 'Lanshu', 'Levante', 'Lissyl', 'Lokaar', 'Loken', 'Lomar', 'Lonwabo',
	'Lord Saladin', 'Lord Shaxx', 'Malahayati', 'Malok', 'Malphur', 'Mara Sov', 'Maraid', 'Mecher', 'Mengoor', 'Micha', 'Mihaylova',
	'Minotaurs', 'Modris', 'Mormu', 'Nanotech', 'Nascia', 'Nicha', 'Ning', 'Nolg', 'Novarro', 'Omnigul', 'Oort', 'Orbiks', 'Osiris',
	'Palamon', 'PallasBane', 'Parixas', 'Paskin', 'Peekis', 'Petra', 'Pinar', 'Pirsis', 'Praxic', 'Psion', 'Qiao', 'Qodron',
	'Queenbreakers', 'Qugu', 'Quria', 'Racin', 'Rafriit', 'Rahndel', 'Ralph the Chicken', 'Rasputin', 'Red Legion', 'Redjack', 'Reefborn',
	'Rezyl', 'Rience', 'Riksis', 'Roni', 'SABER', 'Saint-14', 'Sardok', 'Sardon', 'Sathona', 'Saviks', 'Sayeth', 'Sedia', 'Segoth',
	'Sekrion', 'Sepiks', 'Shaxx', 'Shirazi', 'Shiro-4', 'Shuro', 'Shvubi', 'Silimar', 'Simiks', 'Skoriks', 'Skorri', 'Skriviks',
	'Skyburners', 'Solkis', 'Starcutters', 'Sundaresh', 'Suros', 'Sweeper Bot', 'Swiftling', 'Sylok', 'Taeko', 'Taishibethi', 'Taniks',
	'Taox', 'Tarlowe', 'Teben', 'Techeun', 'Techeuns', 'Telthor', 'Tescan', 'Tevis', 'Thalnok', 'The Speaker', 'The Traveler', 'Theosyion',
	'Thuria', 'Timur', 'Tinette', 'Toland', 'Tover', 'Trenn', 'Tubach', 'Tuyet', 'Uldren Sov', 'Urrox', 'Urzok', 'Uzoma', 'Valus', 'Vekis',
	'Veliniks', 'Velor', 'Venj', 'Vestan', 'Vestian', 'Virixas', 'Vorlog', 'Warmind', 'Warminds', 'Warpriest', 'Warsat', 'Wei Ning',
	'Weksis', 'Wintership', 'WorldRender', 'Wormfood', 'Xander 99-40', 'Xivu', 'Xol', 'Xur', 'Xyor', 'Yavek', 'Zarin', 'Zhalo', 'Zire',
	'Zydron', 'Zyre', 'Zyrok', 'Fallen', 'Taken', 'Cabal', 'Vex', 'Harpy', 'Dreg', 'Vandal', 'Hunter', 'Titan', 'Warlock', 'Ogre',
	'Acolyte', 'Thrall', 'M\'Orn', 'Ta\'Aurc', 'B\'Ael', 'Aru\'Un', 'Tho\'Ourg', 'Va\'Ase', 'Louis', 'EDZ', 'Nessus', 'Io',
	'Dawnblade', 'Stormcaller', 'Voidwalker', 'Arcstrider', 'Gunslinger', 'Nightstalker', 'Striker', 'Sentinel', 'Sunbreaker'];

Constants.footer = `\n\n**Special Note:** If you reply to this message it will be sent to the moderator team. If you are unable to reply to the bot, please check that you have not blocked the bot, disabled server messages, and share a server with the bot. If you do not share a server with the bot, you may join this one: ${Constants.appealsServer}.`;
export default Constants;
