const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { UserType } = require('../types');
const { USERS } = require('../../mockData');

const userMutations = {
	createUser: {
		type: UserType,
		description: 'Creates a new user',
		args: {
			name: { type: GraphQLNonNull(GraphQLString) },
			profileImage: { type: GraphQLString },
			createdAt: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: (parent, { name, profileImage, createdAt }) => {
			const newUser = {
				id: `${USERS.length + 1}`,
				name,
				profileImage,
				createdAt,
				deleted: false,
			};
			USERS.push(newUser);
			return newUser;
		},
	},
	updateUser: {
		type: UserType,
		description: 'Updates an existing user',
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
			name: { type: GraphQLNonNull(GraphQLString) },
			profileImage: { type: GraphQLString },
		},
		resolve: (parent, { id, name, profileImage }) => {
			const userToUpdateIndex = USERS.findIndex(
				({ id: userId }) => id === userId,
			);

			//Early exit - attempting to update an non exisiting record
			if (userToUpdateIndex === -1) {
				return null;
			}

			const userToUpdate = USERS[userToUpdateIndex];
			const updatedUser = {
				...userToUpdate,
				name,
				profileImage,
			};
			USERS[userToUpdateIndex] = { ...updatedUser };
			return updatedUser;
		},
	},
	deleteUser: {
		type: UserType,
		description: 'Deletes an existing user',
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: (parent, { id }) => {
			const userToDeleteIndex = USERS.findIndex(
				({ id: userId }) => id === userId,
			);

			//Early exit - attempting to delete an non exisiting record
			if (userToDeleteIndex === -1) {
				return null;
			}

			const userToDelete = USERS[userToDeleteIndex];
			if (userToDelete.deleted) return userToDelete;

			const deletedUser = {
				...userToDelete,
				deleted: true,
			};

			USERS[userToDeleteIndex] = { ...deletedUser };
			return deletedUser;
		},
	},
};

module.exports = userMutations;
