export const createMessageMutation = `
  mutation CreateMessage($userId: ID!, $chatId: ID!, $message: String!, $createdAt: String!) {
    createMessage(userId: $userId, chatId: $chatId, message: $message, createdAt: $createdAt) {
      id
      userId
      message
      deleted
      createdAt
      user {
        id
        name
        profileImage
        deleted
      }
      chat {
        id
        name
        userIds
        deleted
        createdAt
        deleted
      }
    }
  }
`;

export default createMessageMutation;
