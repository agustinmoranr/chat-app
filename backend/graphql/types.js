const {
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
} = require('graphql');
const { MESSAGES, USERS, CHATS } = require('../mockData');
const dayjs = require('dayjs');

const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'This is the type of an User',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLNonNull(GraphQLString) },
		profileImage: { type: GraphQLString },
		deleted: { type: GraphQLNonNull(GraphQLBoolean) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
		chats: {
			type: GraphQLList(ChatType),
			resolve: ({ id }, args) => {
				const chats = CHATS.filter(({ userIds, deleted }) => {
					return userIds.find((userId) => userId === id && !deleted);
				});
				return chats;
			},
		},
	}),
});

const ChatType = new GraphQLObjectType({
	name: 'Chat',
	description: 'This is the type of a Chat',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLNonNull(GraphQLString) },
		userIds: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
		deleted: { type: GraphQLNonNull(GraphQLBoolean) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
		messages: {
			type: GraphQLList(MessageType),
			resolve: ({ id }) => {
				const messages = MESSAGES.filter(
					({ chatId, deleted }) => id === chatId && !deleted,
				);
				//sort by date
				return messages.sort(
					(a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
				);
			},
		},
		users: {
			type: GraphQLList(UserType),
			resolve: ({ userIds = [] }) => {
				const users = USERS.filter(({ id }) => userIds.includes(id));
				return users;
			},
		},
	}),
});

const MessageType = new GraphQLObjectType({
	name: 'Message',
	description: 'This is the definition of a Message type',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		userId: { type: GraphQLNonNull(GraphQLID) },
		chatId: { type: GraphQLNonNull(GraphQLID) },
		message: { type: GraphQLNonNull(GraphQLString) },
		deleted: { type: GraphQLNonNull(GraphQLBoolean) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
		user: {
			type: UserType,
			resolve: ({ userId }, args) => {
				return USERS.find(({ id }) => id === userId);
			},
		},
		chat: {
			type: ChatType,
			resolve: ({ chatId }, args) => {
				return CHATS.find(({ id }) => id === chatId);
			},
		},
	}),
});

module.exports = {
	MessageType,
	UserType,
	ChatType,
};
