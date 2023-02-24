const MessageQueries = require('./messages');
const UserQueries = require('./users');
const ChatQueries = require('./chat');

module.exports = {
	...MessageQueries,
	...UserQueries,
	...ChatQueries,
};
