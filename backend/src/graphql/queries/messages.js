const { GraphQLList, GraphQLID } = require('graphql');
const { MessageType } = require('../types');
const { filterDeletedRecords } = require('../../utils');
const { MESSAGES } = require('../../mockData');

const MessageQueries = {
	listMessages: {
		type: new GraphQLList(MessageType),
		description: 'List of Messages',
		resolve: () => filterDeletedRecords(MESSAGES),
	},
	listMessagesByUserId: {
		type: new GraphQLList(MessageType),
		description: 'List of Messages by user id',
		args: {
			id: { type: GraphQLID },
		},
		resolve: (parent, { id }) => {
			return MESSAGES.filter(
				({ userId, deleted }) => id === userId && !deleted,
			);
		},
	},
	listMessagesByChatId: {
		type: new GraphQLList(MessageType),
		description: 'List of Messages by chat id',
		args: {
			id: { type: GraphQLID },
		},
		resolve: (parent, { id }) => {
			return MESSAGES.filter(
				({ chatId, deleted }) => id === chatId && !deleted,
			);
		},
	},
	getMessage: {
		type: MessageType,
		description: 'Retrieve a sigle message',
		args: {
			id: { type: GraphQLID },
		},
		resolve: (parent, { id }) => {
			return MESSAGES.find(({ id: messageId }) => messageId === id);
		},
	},
};

module.exports = MessageQueries;
