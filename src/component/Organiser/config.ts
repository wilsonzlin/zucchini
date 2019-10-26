import {Field} from "model/Song";

export const FilterByOptionLabels = new Map<Field | undefined, string>([
  [undefined, "all songs"],
  ["album", "only songs in the album"],
  ["artists", "only songs by the artist"],
  ["decade", "only songs in the decade"],
  ["genres", "only songs of the genre"],
]);

export const GroupByOptionLabels = new Map<Field | undefined, string>([
  [undefined, "(none)"],
  ["album", "album"],
  ["artists", "artist"],
  ["decade", "decade"],
  ["genres", "genre"],
  ["title", "title"],
]);

export const SubgroupByOptionLabels = new Map<Field | undefined, string>([
  [undefined, "(none)"],
  ["album", "album"],
  ["artists", "artist"],
  ["decade", "decade"],
  ["genres", "genre"],
  ["title", "title"],
]);
