import system from './resolvers/system';
import auth from './resolvers/auth';
import media from './resolvers/media';
import posts from './resolvers/posts';
import postCategory from './resolvers/postCategory';
import postTag from './resolvers/postTag';
import pages from './resolvers/pages';
import pageCategory from './resolvers/pageCategory';
import pageTag from './resolvers/pageTag';
import users from './resolvers/users';
import pageTemplates from './resolvers/pageTemplates';
import menus from './resolvers/menus';

const graphqlResolver = {
  ...system,
  ...menus,
  ...auth,
  ...media,
  ...posts,
  ...postCategory,
  ...postTag,
  ...pages,
  ...pageCategory,
  ...pageTag,
  ...pageTemplates,
  ...users,
};

export default graphqlResolver;
