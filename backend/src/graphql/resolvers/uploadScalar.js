import { GraphQLScalarType } from 'graphql';

const Upload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value) {
    return value; // Already handled by your middleware!
  },
  serialize(value) {
    return value;
  },
  parseLiteral() {
    throw new Error('Upload literal unsupported.');
  },
});

export default Upload;
