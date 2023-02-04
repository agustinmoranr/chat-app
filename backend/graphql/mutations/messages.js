const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { MessageType } = require('../types');
const { MESSAGES } = require('../../mockData');

const messageMutations = {
	createMessage: {
		type: MessageType,
		description: 'Creates a new Message',
		args: {
			message: { type: GraphQLNonNull(GraphQLString) },
			userId: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: (parent, { message, userId }) => {
			const newMessage = {
				id: `${MESSAGES.length + 1}`,
				userId,
				message,
				deleted: false,
			};
			MESSAGES.push(newMessage);
			return newMessage;
		},
	},
	updateMessage: {
		type: MessageType,
		description: 'Updates an existing message',
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
			message: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: (parent, { id, message }) => {
			const messageToUpdateIndex = MESSAGES.findIndex(
				({ id: messageId }) => id === messageId,
			);

			//Early exit - attempting to update an non exisiting record
			if (messageToUpdateIndex === -1) {
				return null;
			}

			const messageToUpdate = MESSAGES[messageToUpdateIndex];
			const updatedMessage = {
				...messageToUpdate,
				message,
			};
			MESSAGES[messageToUpdateIndex] = { ...updatedMessage };
			return updatedMessage;
		},
	},
	deleteMessage: {
		type: MessageType,
		description: 'Deletes an existing message',
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: (parent, { id }) => {
			const messageToDeleteIndex = MESSAGES.findIndex(
				({ id: messageId }) => id === messageId,
			);

			//Early exit - attempting to delete an non exisiting record
			if (messageToDeleteIndex === -1) {
				return null;
			}

			const messageToDelete = MESSAGES[messageToDeleteIndex];
			if (messageToDelete.deleted) return messageToDelete;

			const deletedMessage = {
				...messageToDelete,
				deleted: true,
			};

			MESSAGES[messageToDeleteIndex] = { ...deletedMessage };
			return deletedMessage;
		},
	},
};

module.exports = messageMutations;
