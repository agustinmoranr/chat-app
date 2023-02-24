const dayjs = require('dayjs');

const USERS = [
	{
		id: '1',
		name: 'Agustin Moran',
		profileImage: 'profile.jpg',
		deleted: false,
		createdAt: dayjs('2022-02-21').toISOString(),
	},
	{
		id: '2',
		name: 'Miranda',
		profileImage: 'miranda.jpg',
		deleted: false,
		createdAt: dayjs('2022-02-21').toISOString(),
	},
];

const CHATS = [
	{
		id: '1',
		name: 'Agustin & Miranda',
		userIds: ['1', '2'],
		createdAt: dayjs('2022-02-21').toISOString(),
		deleted: false,
	},
];

const MESSAGES = [
	{
		id: '1',
		userId: '1',
		chatId: '1',
		message: '¡Hola Miranda!',
		createdAt: dayjs().subtract(5, 'minutes').toISOString(),
		deleted: false,
	},
	{
		id: '2',
		userId: '2',
		chatId: '1',
		message: '!Hola Agus¡ ¿Cómo estás?',
		createdAt: dayjs().toISOString(),
		deleted: false,
	},
];

module.exports = {
	USERS,
	CHATS,
	MESSAGES,
};
