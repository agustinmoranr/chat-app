export const getChatQuery = `
  query GetChat($id: ID!) {
    getChat(id: $id) {
      id
      name
      userIds
      deleted
      createdAt
      users {
        id
        name
        profileImage
        deleted
      }
      messages {
        id
        userId
        chatId
        message
        deleted
        createdAt
      }
    }
  }
`;

export default getChatQuery;
