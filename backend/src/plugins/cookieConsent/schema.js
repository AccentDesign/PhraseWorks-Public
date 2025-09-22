export default /* GraphQL */ `
  extend type Query {
    getCookieConsentSettings: String!
  }
  extend type Mutation {
    updateCookieConsentSettings(data: String!): SuccessData!
  }
`;
