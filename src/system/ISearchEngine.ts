import {Song} from "../common/Media";

export interface ISearchEngine {
  search (term: string): Promise<string[]>;

  loadData (songs: Song[]): void;
}
