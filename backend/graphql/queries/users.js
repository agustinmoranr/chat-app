const { GraphQLList, GraphQLID } = require('graphql');
const { UserType } = require('../types');
const { USERS } = require('../../mockData');

const UsersQueries = {
	listUsers: {
		type: new GraphQLList(UserType),
		description: 'List of Users',
		resolve: () => USERS,
	},
	getUser: {
		type: UserType,
		description: 'Retrieve a sigle user',
		args: {
			id: { type: GraphQLID },
		},
		resolve: (parent, { id }) => {
			return USERS.find(({ id: userId }) => userId === id);
		},
	},
};

module.exports = UsersQueries;
