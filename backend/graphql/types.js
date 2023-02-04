const {
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
} = require('graphql');
const { MESSAGES, USERS } = require('../mockData');

const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'This is the type of an User',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLNonNull(GraphQLString) },
		messages: {
			type: GraphQLList(MessageType),
			resolve: ({ id }, args) => {
				return MESSAGES.filter(
					({ userId, deleted }) => id === userId && !deleted,
				);
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
		message: { type: GraphQLNonNull(GraphQLString) },
		deleted: { type: GraphQLNonNull(GraphQLBoolean) },
		user: {
			type: UserType,
			resolve: ({ userId }, args) => {
				return USERS.find(({ id }) => id === userId);
			},
		},
	}),
});

module.exports = {
	MessageType,
	UserType,
};
