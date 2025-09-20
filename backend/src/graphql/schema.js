import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { pluginTypeDefs } from '../generated/pluginResolvers.js';
import Upload from './resolvers/uploadScalar.js';

import baseTypeDefs from './baseSchema.js';
import { createResolvers } from './resolvers.js';

export async function createSchema(connection) {
  const typeDefs = mergeTypeDefs([baseTypeDefs, ...pluginTypeDefs]);
  const resolvers = await createResolvers(connection);

  return makeExecutableSchema({
    typeDefs,
    resolvers: {
      ...resolvers,
      Upload,
    },
  });
}
