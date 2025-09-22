export default /* GraphQL */ `
  extend type Query {
    getGoogleFonts: String!
  }
  extend type Mutation {
    downloadGoogleFont(font: String!): SuccessData!
  }
`;
