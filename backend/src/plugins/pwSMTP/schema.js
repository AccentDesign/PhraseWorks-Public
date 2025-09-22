export default /* GraphQL */ `
  extend type Query {
    getPWSMTPData: String!
  }
  extend type Mutation {
    sendTestEmail(toAddress: String!): SuccessData!
    updatePWSMTPData(dBData: String): SuccessData!
  }
`;
