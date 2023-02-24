export const updateMessageMutation = `
  mutation UpdateMessage($id: ID!, $message: String!) {
    updateMessage(id: $id, message: $message) {
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

export default updateMessageMutation;
