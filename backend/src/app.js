const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const body_parser = require('body-parser');
require('dotenv').config();
const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const queries = require('./graphql/queries');
const mutations = require('./graphql/mutations');
const app = express();
const ORIGINS = [process.env.ORIGIN_NETLIFY, process.env.ORIGIN_AWS_AMPLIFY];

//Creación de esquema con buildSchema
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

const corsConfig = {
	origin: ORIGINS,
};

app.use(cors(corsConfig));
app.use(body_parser.json({ limit: '50mb' }));
app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		// rootValue: root,
		graphiql: true,
	}),
);

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(PORT, () =>
// 	console.log(`Server running successfully in port:${PORT}`),
// );

// Export your express server so you can import it in the lambda function.
module.exports = app;
