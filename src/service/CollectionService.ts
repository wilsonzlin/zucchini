import {File, FileType, Listing} from 'model/Listing';

export class CollectionServiceServerError extends Error {
  constructor (message: string) {
    super(message);
  }
}

export class CollectionServiceClientError extends Error {
  constructor (message: string) {
    super(message);
  }
}

export class CollectionServiceUnauthenticatedError extends Error {
  constructor () {
    super();
  }
}

export type GetCurrentUserApi = (req: {}) => Promise<{
  // If undefined, is guest.
  username?: string;
}>;

export type GetCustomPlaylistsApi = (req: {}) => Promise<{
  playlists: { id: string; name: string; modifiable: boolean; }[];
}>;

export type GetSignInOptionsApi = (req: {}) => Promise<{
  users: { username: string; requiresPassword?: boolean; }[];
  manual: boolean;
  guest: boolean;
}>;

export type ListApi = (req: {
  source: { playlist: string } | { path: string[]; subdirectories: boolean; };
  filter?: string;
  groupBy?: string[]
  sortBy?: string[],
  types: FileType[];
  continuation?: string;
}) => Promise<{
  results: Listing[];
  approximateSize?: number;
  approximateDuration?: number;
  approximateCount?: number;
  continuation?: string;
}>;

export type RenameCustomPlaylistApi = (req: {
  // At least one of {from, to} is provided.
  from?: string;
  to?: string;
}) => Promise<{}>;

export type SearchAutocompleteApi = (req: {
  query: string;
}) => Promise<{
  expansions: string[];
}>;

export type SignInApi = (req: {
  // If undefined, is guest.
  username?: string;
  // Empty for guest and users that do not require passwords.
  password: string;
}) => Promise<{}>;

export type SignOutApi = (req: {}) => Promise<{}>;

export type UpdatePlaylistEntriesApi = (req: {
  playlist: string;
  // At least one of {oldPosition, newPosition} is provided.
  changes: { file: File; oldPosition?: number; newPosition?: number; }[];
}) => Promise<{}>;

export interface ICollectionService {
  getCurrentUser: GetCurrentUserApi;
  getCustomPlaylists: GetCustomPlaylistsApi;
  getSignInOptions: GetSignInOptionsApi;
  list: ListApi;
  renameCustomPlaylist: RenameCustomPlaylistApi;
  searchAutocomplete: SearchAutocompleteApi;
  signIn: SignInApi;
  signOut: SignOutApi;
  updatePlaylistEntries: UpdatePlaylistEntriesApi;
}
