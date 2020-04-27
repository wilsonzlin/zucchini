export enum SpecialPlaylist {
  LIKES,
  DISLIKES,
}

export class GroupDelimiter {
  constructor (
    readonly title: string,
    readonly level: number,
  ) {
  }
}
