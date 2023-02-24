export const listUserQuery = `
  query ListUsers {
    listUsers {
      id
      name
      profileImage
      deleted
      createdAt
      chats {
        id
        name
        userIds
        createdAt
        deleted
      }
    }
  }
`;

export default listUserQuery;
