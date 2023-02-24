export const deleteMessageMutation = `
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
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

export default deleteMessageMutation;
