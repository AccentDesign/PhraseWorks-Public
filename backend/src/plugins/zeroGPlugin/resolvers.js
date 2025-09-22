import { mergeResolvers } from '@graphql-tools/merge';
import forms from './resolvers/forms.js';
import formEntries from './resolvers/formEntries.js';
import formConfirmations from './resolvers/formConfirmations.js';
import formNotifications from './resolvers/formNotifications.js';

export async function createResolvers() {
  const staticResolversArray = [forms, formEntries, formConfirmations, formNotifications];

  return mergeResolvers(staticResolversArray);
}
