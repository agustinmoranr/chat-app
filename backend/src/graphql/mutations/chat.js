const {
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLList,
} = require('graphql');
const { ChatType } = require('../types');
const { CHATS } = require('../../mockData');

const chatMutations = {
	createChat: {
		type: ChatType,
		description: 'Creates a new Chat',
		args: {
			name: { type: GraphQLNonNull(GraphQLString) },
			userIds: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
			createdAt: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: (parent, { name, userIds, createdAt }) => {
			const newChat = {
				id: `${CHATS.length + 1}`,
				name,
				userIds,
				createdAt,
				deleted: false,
			};
			CHATS.push(newChat);
			return newChat;
		},
	},
	updateChat: {
		type: ChatType,
		description: 'Updates an existing chat',
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
			name: { type: GraphQLString },
			userIds: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
		},
		resolve: (parent, { id, name, userIds = [] }) => {
			const chatToUpdateIndex = CHATS.findIndex(
				({ id: chatId }) => id === chatId,
			);

			//Early exit - attempting to update an non exisiting record
			if (chatToUpdateIndex === -1) {
				return null;
			}

			const chatToUpdate = CHATS[chatToUpdateIndex];
			const newUserIds = Boolean(userIds.length)
				? new Set(userIds)
				: new Set(chatToUpdate.userIds);
			const newName = Boolean(name) ? name : chatToUpdate.name;
			const updatedChat = {
				...chatToUpdate,
				name: newName,
				userIds: [...newUserIds],
			};
			CHATS[chatToUpdateIndex] = { ...updatedChat };
			return updatedChat;
		},
	},
	deleteChat: {
		type: ChatType,
		description: 'Deletes an existing chat',
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: (parent, { id }) => {
			const chatToDeleteIndex = CHATS.findIndex(
				({ id: chatId }) => id === chatId,
			);

			//Early exit - attempting to delete an non exisiting record
			if (chatToDeleteIndex === -1) {
				return null;
			}

			const chatToDelete = CHATS[chatToDeleteIndex];
			if (chatToDelete.deleted) return chatToDelete;

			const deletedChat = {
				...chatToDelete,
				deleted: true,
			};

			CHATS[chatToDeleteIndex] = { ...deletedChat };
			return deletedChat;
		},
	},
};

module.exports = chatMutations;
