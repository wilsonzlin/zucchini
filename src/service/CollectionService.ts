import {MediaFile, MediaFileType} from '../model/Media';
import {GroupDelimiter, SpecialPlaylist} from '../model/Playlist';

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

export interface ICollectionService {
  searchAutocomplete (req: {
    query: string;
  }): Promise<{
    expansions: string[];
  }>;

  list (req: {
    source: { playlist: SpecialPlaylist | string } | { path: string[]; subdirectories: boolean; };
    filter?: string;
    groupBy?: string[]
    sortBy?: string[],
    types: MediaFileType[];
    continuation?: string;
  }): Promise<{
    results: (GroupDelimiter | MediaFile)[];
    approximateSize?: number;
    approximateDuration?: number;
    approximateCount?: number;
    continuation?: string;
  }>;

  getCurrentUser (req: {}): Promise<{
    // If undefined, is guest.
    username?: string;
  }>;

  signIn (req: {
    // If undefined, is guest.
    username?: string;
    // Empty for guest and users that do not require passwords.
    password: string;
  }): Promise<{}>;

  signOut (req: {}): Promise<{}>;

  getSignInOptions (req: {}): Promise<{
    users: { username: string; requiresPassword?: boolean; }[];
    manual: boolean;
    guest: boolean;
  }>;

  manageCustomPlaylist (req: {
    // At least one of {from, to} is provided.
    from?: string;
    to?: string;
  }): Promise<{}>;

  getCustomPlaylists (req: {}): Promise<{
    playlists: { id: string; name: string; modifiable: boolean; }[];
  }>;

  updatePlaylistEntries (req: {
    playlist: SpecialPlaylist | string;
    // At least one of {oldPosition, newPosition} is provided.
    changes: { file: MediaFile; oldPosition?: number; newPosition?: number; }[];
  }): Promise<{}>;
}
