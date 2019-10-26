import {Field} from "model/Song";

export const FilterByOptionLabels = new Map<Field | undefined, string>([
  [undefined, "all songs"],
  ["album", "songs in the album"],
  ["artists", "songs by the artist"],
  ["decade", "songs in the decade"],
  ["genres", "songs of the genre"],
]);

export const GroupByOptionLabels = new Map<Field | undefined, string>([
  [undefined, "together."],
  ["album", "grouped by album"],
  ["artists", "grouped by artist"],
  ["decade", "grouped by decade"],
  ["genres", "grouped by genre"],
  ["title", "grouped by title"],
]);

export const SubgroupByOptionLabels = new Map<Field | undefined, string>([
  [undefined, "."],
  ["album", "then by album."],
  ["artists", "then by artist."],
  ["decade", "then by decade."],
  ["genres", "then by genre."],
  ["title", "then by title."],
]);
