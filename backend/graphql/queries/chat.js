const { GraphQLList, GraphQLID } = require('graphql');
const { ChatType } = require('../types');
const { filterDeletedRecords } = require('../../utils');
const { CHATS } = require('../../mockData');

const ChatQueries = {
	listChats: {
		type: new GraphQLList(ChatType),
		description: 'List of Chats',
		resolve: () => filterDeletedRecords(CHATS),
	},
	listChatsByUserId: {
		type: new GraphQLList(ChatType),
		description: 'List of Chats by user id',
		args: {
			id: { type: GraphQLID },
		},
		resolve: (parent, { id }) => {
			return CHATS.filter(({ userIds, deleted }) => {
				return userIds.find((userId) => userId === id && !deleted);
			});
		},
	},
	getChat: {
		type: ChatType,
		description: 'Retrieve a sigle Chat',
		args: {
			id: { type: GraphQLID },
		},
		resolve: (parent, { id }) => {
			return CHATS.find(({ id: chatId }) => chatId === id);
		},
	},
};

module.exports = ChatQueries;
