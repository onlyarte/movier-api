import { GraphQLContext } from '../context';

export function assertCurrentUser(context: GraphQLContext) {
  if (context.currentUser) {
    return context.currentUser;
  }
  throw new Error('Unauthorized');
}
