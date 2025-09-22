export default /* GraphQL */ `
  extend type Query {
    getAdminColumn(id: String!): Column!
    getAdminColumns: [Column]!
  }
  extend type Mutation {
    updateAdminColumnsEntries(data: String!): SuccessData!
    deleteAdminColumnEntries(indexes: String): SuccessData
  }

  type Column {
    id: String!
    postType: String!
    fields: [Field]
  }
`;
