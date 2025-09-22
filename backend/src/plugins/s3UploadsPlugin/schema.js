export default /* GraphQL */ `
  extend type Query {
    getS3UploadPluginOptions: String!
  }
  extend type Mutation {
    updateS3UploadPluginOptions(
      bucketName: String
      endpoint: String
      accessKeyId: String
      secretAccessKey: String
    ): SuccessData!
  }
`;
