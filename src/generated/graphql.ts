import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel, List as ListModel } from '@prisma/client';
import { Movie as MovieModel, Providers as ProvidersModel } from 'src/services/Movie/TMDB/types';
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
  recommendations: Array<Movie>;
  title: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type Movie = {
  __typename?: 'Movie';
  countries?: Maybe<Array<Scalars['String']>>;
  description?: Maybe<Scalars['String']>;
  directors?: Maybe<Array<Scalars['String']>>;
  genres?: Maybe<Array<Scalars['String']>>;
  imdbId?: Maybe<Scalars['String']>;
  notes?: Maybe<Array<Note>>;
  poster?: Maybe<Scalars['String']>;
  providers?: Maybe<Providers>;
  rating?: Maybe<Scalars['Float']>;
  stars?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  tmdbId: Scalars['ID'];
  trailerUrl?: Maybe<Scalars['String']>;
  writers?: Maybe<Array<Scalars['String']>>;
  year?: Maybe<Scalars['Int']>;
};


export type MovieProvidersArgs = {
  region: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addNoteToMovie: Note;
  createList: List;
  deleteList: Scalars['Boolean'];
  deleteNoteFromMovie: Scalars['Boolean'];
  followUser: Scalars['Boolean'];
  importMoviesFromImdb: Scalars['Boolean'];
  pullMovie: Scalars['Boolean'];
  pushMovie: Scalars['Boolean'];
  saveList: Scalars['Boolean'];
  unfollowUser: Scalars['Boolean'];
  unsaveList: Scalars['Boolean'];
  updateList: List;
  updateUser: User;
  upsertUserLocation: Scalars['Boolean'];
};


export type MutationAddNoteToMovieArgs = {
  content: Scalars['String'];
  movieTmdbId: Scalars['Int'];
};


export type MutationCreateListArgs = {
  input: CreateListInput;
};


export type MutationDeleteListArgs = {
  id: Scalars['String'];
};


export type MutationDeleteNoteFromMovieArgs = {
  noteId: Scalars['String'];
};


export type MutationFollowUserArgs = {
  id: Scalars['String'];
};


export type MutationImportMoviesFromImdbArgs = {
  imdbIds: Array<Scalars['String']>;
  listId: Scalars['String'];
};


export type MutationPullMovieArgs = {
  listId: Scalars['String'];
  movieTmdbId: Scalars['Int'];
};


export type MutationPushMovieArgs = {
  listId: Scalars['String'];
  movieTmdbId: Scalars['Int'];
};


export type MutationSaveListArgs = {
  id: Scalars['String'];
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


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpsertUserLocationArgs = {
  input: UpsertUserLocationInput;
};

export type Note = {
  __typename?: 'Note';
  content: Scalars['String'];
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  movie?: Maybe<Movie>;
  user?: Maybe<User>;
};

export type Provider = {
  __typename?: 'Provider';
  id: Scalars['ID'];
  providerLogoUrl: Scalars['String'];
  providerName: Scalars['String'];
};

export type Providers = {
  __typename?: 'Providers';
  buy?: Maybe<Array<Provider>>;
  flatrate?: Maybe<Array<Provider>>;
  id: Scalars['ID'];
  rent?: Maybe<Array<Provider>>;
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
  tmdbId: Scalars['Int'];
};


export type QuerySearchArgs = {
  input: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};

export type UpdateListInput = {
  cover?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  about?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  photoUrl?: InputMaybe<Scalars['String']>;
};

export type UpsertUserLocationInput = {
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  ip?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  favourite?: Maybe<List>;
  followers: Array<User>;
  following: Array<User>;
  id: Scalars['ID'];
  lists: Array<List>;
  location?: Maybe<UserLocation>;
  name: Scalars['String'];
  photoUrl?: Maybe<Scalars['String']>;
  savedLists: Array<List>;
  watchlist?: Maybe<List>;
};

export type UserLocation = {
  __typename?: 'UserLocation';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  ip?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
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
  Movie: ResolverTypeWrapper<MovieModel>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Omit<Note, 'movie' | 'user'> & { movie?: Maybe<ResolversTypes['Movie']>, user?: Maybe<ResolversTypes['User']> }>;
  Provider: ResolverTypeWrapper<Provider>;
  Providers: ResolverTypeWrapper<ProvidersModel>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateListInput: UpdateListInput;
  UpdateUserInput: UpdateUserInput;
  UpsertUserLocationInput: UpsertUserLocationInput;
  User: ResolverTypeWrapper<UserModel>;
  UserLocation: ResolverTypeWrapper<UserLocation>;
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
  Movie: MovieModel;
  Mutation: {};
  Note: Omit<Note, 'movie' | 'user'> & { movie?: Maybe<ResolversParentTypes['Movie']>, user?: Maybe<ResolversParentTypes['User']> };
  Provider: Provider;
  Providers: ProvidersModel;
  Query: {};
  String: Scalars['String'];
  UpdateListInput: UpdateListInput;
  UpdateUserInput: UpdateUserInput;
  UpsertUserLocationInput: UpsertUserLocationInput;
  User: UserModel;
  UserLocation: UserLocation;
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
  recommendations?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = {
  countries?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  directors?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  genres?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  imdbId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<Array<ResolversTypes['Note']>>, ParentType, ContextType>;
  poster?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  providers?: Resolver<Maybe<ResolversTypes['Providers']>, ParentType, ContextType, RequireFields<MovieProvidersArgs, 'region'>>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  stars?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tmdbId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  trailerUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  writers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addNoteToMovie?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationAddNoteToMovieArgs, 'content' | 'movieTmdbId'>>;
  createList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationCreateListArgs, 'input'>>;
  deleteList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteListArgs, 'id'>>;
  deleteNoteFromMovie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteNoteFromMovieArgs, 'noteId'>>;
  followUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'id'>>;
  importMoviesFromImdb?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationImportMoviesFromImdbArgs, 'imdbIds' | 'listId'>>;
  pullMovie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPullMovieArgs, 'listId' | 'movieTmdbId'>>;
  pushMovie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPushMovieArgs, 'listId' | 'movieTmdbId'>>;
  saveList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveListArgs, 'id'>>;
  unfollowUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'id'>>;
  unsaveList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnsaveListArgs, 'id'>>;
  updateList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationUpdateListArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  upsertUserLocation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpsertUserLocationArgs, 'input'>>;
};

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  movie?: Resolver<Maybe<ResolversTypes['Movie']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Provider'] = ResolversParentTypes['Provider']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  providerLogoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  providerName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProvidersResolvers<ContextType = any, ParentType extends ResolversParentTypes['Providers'] = ResolversParentTypes['Providers']> = {
  buy?: Resolver<Maybe<Array<ResolversTypes['Provider']>>, ParentType, ContextType>;
  flatrate?: Resolver<Maybe<Array<ResolversTypes['Provider']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rent?: Resolver<Maybe<Array<ResolversTypes['Provider']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  list?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType, RequireFields<QueryListArgs, 'id'>>;
  movie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<QueryMovieArgs, 'tmdbId'>>;
  search?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'input'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favourite?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType>;
  followers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  following?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lists?: Resolver<Array<ResolversTypes['List']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['UserLocation']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  savedLists?: Resolver<Array<ResolversTypes['List']>, ParentType, ContextType>;
  watchlist?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLocation'] = ResolversParentTypes['UserLocation']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  List?: ListResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  Provider?: ProviderResolvers<ContextType>;
  Providers?: ProvidersResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserLocation?: UserLocationResolvers<ContextType>;
};

