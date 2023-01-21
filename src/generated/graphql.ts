import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel, List as ListModel } from '@prisma/client';
import { ParsedMovie as MovieModel } from 'src/services/TMDB/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type CreateListInput = {
  cover?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type List = {
  __typename?: 'List';
  cover?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  movies: Array<Movie>;
  owner: User;
  title: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  token: Scalars['String'];
  user: User;
};

export type Movie = {
  __typename?: 'Movie';
  countries: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  directors?: Maybe<Array<Scalars['String']>>;
  genres: Array<Scalars['String']>;
  id: Scalars['Int'];
  imdbId?: Maybe<Scalars['String']>;
  poster?: Maybe<Scalars['String']>;
  rating: Scalars['Float'];
  stars?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  trailerUrl?: Maybe<Scalars['String']>;
  writers?: Maybe<Array<Scalars['String']>>;
  year: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createList: List;
  deleteList: Scalars['Boolean'];
  followUser: Scalars['Boolean'];
  login: LoginOutput;
  pullMovie: Scalars['Boolean'];
  pushMovie: Scalars['Boolean'];
  saveList: Scalars['Boolean'];
  signup: LoginOutput;
  unfollowUser: Scalars['Boolean'];
  unsaveList: Scalars['Boolean'];
  updateList: List;
};


export type MutationCreateListArgs = {
  input: CreateListInput;
};


export type MutationDeleteListArgs = {
  id: Scalars['String'];
};


export type MutationFollowUserArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationPullMovieArgs = {
  listId: Scalars['String'];
  movieId: Scalars['Int'];
};


export type MutationPushMovieArgs = {
  listId: Scalars['String'];
  movieId: Scalars['Int'];
};


export type MutationSaveListArgs = {
  id: Scalars['String'];
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUnfollowUserArgs = {
  id: Scalars['String'];
};


export type MutationUnsaveListArgs = {
  id: Scalars['String'];
};


export type MutationUpdateListArgs = {
  id: Scalars['String'];
  input: UpdateListInput;
};

export type Query = {
  __typename?: 'Query';
  list?: Maybe<List>;
  movie: Movie;
  search: Array<Movie>;
  user?: Maybe<User>;
};


export type QueryListArgs = {
  id: Scalars['String'];
};


export type QueryMovieArgs = {
  id: Scalars['Int'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};

export type SignupInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  photoUrl: Scalars['String'];
};

export type UpdateListInput = {
  cover?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  followers: Array<User>;
  following: Array<User>;
  id: Scalars['ID'];
  lists: Array<List>;
  name: Scalars['String'];
  photoUrl: Scalars['String'];
  savedLists: Array<List>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateListInput: CreateListInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  List: ResolverTypeWrapper<ListModel>;
  LoginInput: LoginInput;
  LoginOutput: ResolverTypeWrapper<Omit<LoginOutput, 'user'> & { user: ResolversTypes['User'] }>;
  Movie: ResolverTypeWrapper<MovieModel>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SignupInput: SignupInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateListInput: UpdateListInput;
  User: ResolverTypeWrapper<UserModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateListInput: CreateListInput;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  List: ListModel;
  LoginInput: LoginInput;
  LoginOutput: Omit<LoginOutput, 'user'> & { user: ResolversParentTypes['User'] };
  Movie: MovieModel;
  Mutation: {};
  Query: {};
  SignupInput: SignupInput;
  String: Scalars['String'];
  UpdateListInput: UpdateListInput;
  User: UserModel;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ListResolvers<ContextType = any, ParentType extends ResolversParentTypes['List'] = ResolversParentTypes['List']> = {
  cover?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  movies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginOutput'] = ResolversParentTypes['LoginOutput']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = {
  countries?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  directors?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  genres?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imdbId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  poster?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stars?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trailerUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  writers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationCreateListArgs, 'input'>>;
  deleteList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteListArgs, 'id'>>;
  followUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'id'>>;
  login?: Resolver<ResolversTypes['LoginOutput'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  pullMovie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPullMovieArgs, 'listId' | 'movieId'>>;
  pushMovie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPushMovieArgs, 'listId' | 'movieId'>>;
  saveList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveListArgs, 'id'>>;
  signup?: Resolver<ResolversTypes['LoginOutput'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
  unfollowUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'id'>>;
  unsaveList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnsaveListArgs, 'id'>>;
  updateList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationUpdateListArgs, 'id' | 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  list?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType, RequireFields<QueryListArgs, 'id'>>;
  movie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<QueryMovieArgs, 'id'>>;
  search?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'query'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  following?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lists?: Resolver<Array<ResolversTypes['List']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  savedLists?: Resolver<Array<ResolversTypes['List']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  List?: ListResolvers<ContextType>;
  LoginOutput?: LoginOutputResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

