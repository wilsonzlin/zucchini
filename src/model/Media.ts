export const enum MediaFileType {
  VIDEO,
  AUDIO,
  PHOTO,
}

type MediaFileBase = {
  type: MediaFileType;
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

export type PhotoFile = MediaFileBase & {
  type: MediaFileType.PHOTO;
  width: number;
  height: number;
};

export type VideoFile = MediaFileBase & {
  type: MediaFileType.VIDEO;
  width: number;
  height: number;
  duration: number;
  snippet?: string;
  montage?: { time: string; url: string; };
};

export type AudioFile = MediaFileBase & {
  type: MediaFileType.AUDIO;
  duration: number;
  snippet?: string;
};

export type MediaFile = PhotoFile | VideoFile | AudioFile;
