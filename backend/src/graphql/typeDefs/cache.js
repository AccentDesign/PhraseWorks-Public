import { gql } from 'graphql-tag';

export const cacheTypeDefs = gql`
  type CacheStats {
    connected: Boolean!
    totalKeys: Int!
    memoryInfo: String
    keyspaceInfo: String
    timestamp: Float!
  }

  type CacheOperationResult {
    success: Boolean!
    message: String!
    deletedCount: Int
  }

  extend type Query {
    getCacheStats: CacheStats
  }

  extend type Mutation {
    clearCache(type: String! = "all", tags: [String!] = []): CacheOperationResult!
    warmupCache: CacheOperationResult!
  }
`;