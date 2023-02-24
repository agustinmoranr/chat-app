const messageMutations = require('./messages');
const chatMutations = require('./chat');
const userMutations = require('./users');

module.exports = { ...userMutations, ...messageMutations, ...chatMutations };
