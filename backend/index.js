const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const queries = require('./graphql/queries');
const mutations = require('./graphql/mutations');
const app = express();
const port = 8080;

// const schema = buildSchema(`
//   type Message {
//     id: ID!
//     author: String!
//     content: String!
//     deleted: Boolean
//   }

//   input messageInput {
//     author: String
//     content: String
//   }

//   type Query {
//     getMessage(id: ID!): Message
//     listMessages: [Message]
//   }

//   type Mutation {
//     createMessage(input: messageInput): Message
//     updateMessage(id: ID!, input: messageInput): Message
//     deleteMessage(id: ID!): Message
//   }
// `);

// const root = {
// 	listMessages: () => MESSAGES.filter(({ deleted }) => !deleted),

// 	getMessage: ({ id }) =>
// 		MESSAGES.find(({ id: messageId }) => messageId === id),

// 	createMessage: ({ input }) => {
// 		const newMessage = {
// 			id: `${MESSAGES.length + 1}`,
// 			deleted: false,
// 			...input,
// 		};
// 		MESSAGES.push(newMessage);
// 		return newMessage;
// 	},

// 	updateMessage: ({ id, input }) => {
// 		const messageToUpdateIndex = MESSAGES.findIndex(
// 			({ id: messageId }) => messageId === id,
// 		);

// 		if (messageToUpdateIndex === -1) {
// 			return null;
// 		}

// 		const messageToUpdate = MESSAGES[messageToUpdateIndex];

// 		const updatedMessage = {
// 			...messageToUpdate,
// 			...input,
// 			id: messageToUpdate.id.toString(),
// 		};

// 		MESSAGES[messageToUpdateIndex] = { ...updatedMessage };
// 		return updatedMessage;
// 	},

// 	deleteMessage: ({ id }) => {
// 		const messageToDeleteIndex = MESSAGES.findIndex(
// 			({ id: messageId }) => messageId === id,
// 		);
// 		if (messageToDeleteIndex === -1) {
// 			return null;
// 		}

// 		MESSAGES[messageToDeleteIndex] = {
// 			...MESSAGES[messageToDeleteIndex],
// 			deleted: true,
// 		};
// 		return MESSAGES[messageToDeleteIndex];
// 	},
// };

const RootQueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'This is the root of Queries',
	fields: () => queries,
});

const RootMutationType = new GraphQLObjectType({
	name: 'Mutation',
	description: 'This is the root of mutations',
	fields: () => mutations,
});

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType,
});

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		// rootValue: root,
		graphiql: true,
	}),
);

app.listen(port, () =>
	console.log(`Server running successfully in port:${port}`),
);
