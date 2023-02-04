const MessageQueries = require('./messages');
const UserQueries = require('./users');

module.exports = {
	...MessageQueries,
	...UserQueries,
};
