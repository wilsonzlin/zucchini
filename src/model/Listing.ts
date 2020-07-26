// Used in a listing to group following listings up to the next separator.
export type Del = {
  type: 'del';
  title: string;
};

export type Dir = {
  type: 'dir';
  name: string;
  itemCount: number;
};

export type FileType = 'audio' | 'photo' | 'video';

export const FILE_TYPES = new Set<FileType>(['audio', 'photo', 'video']);

type FileBase = {
  type: FileType;
  id: string;
  url: string;
  title: string;
  size: number;
  format: string;
  // True if liked, false if disliked, undefined if neither.
  opinion?: boolean;
  metadata: {
    [name: string]: string | number | (string | number)[];
  };
  thumbnail?: string;
};

export type Audio = FileBase & {
  type: 'audio';
  duration: number;
  snippet?: string;
};

export type Photo = FileBase & {
  type: 'photo';
  width: number;
  height: number;
};

export type Video = FileBase & {
  type: 'video';
  width: number;
  height: number;
  duration: number;
  snippet?: string;
  montage?: { time: string; url: string; };
};

export type File = Photo | Video | Audio;

export type Listing = Del | Dir | File;

export const isDir = (val: Listing): val is Dir => val.type == 'dir';

export const isNotDir = (val: Listing): val is Del | File => val.type != 'dir';

export const isFile = (val: Listing): val is File => FILE_TYPES.has(val.type as any);

export const isPhotoOrVideo = (val: Listing): val is Photo | Video => val.type == 'photo' || val.type == 'video';

export const isDel = (val: Listing): val is Del => val.type == 'del';
