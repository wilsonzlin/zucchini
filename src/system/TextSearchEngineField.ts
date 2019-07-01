import {Song} from "../common/Media";

// TODO Refactor, comment
export const textSearchEngineFields: (keyof Song)[] = [
  "album", "artists", "genres", "title", "track", "year", "decade",
];

export interface TextSearchEngineAutocomplete {
  field: keyof Song;
  value: string;
}

export const textSearchAutocompleteToKey = (autocomplete: TextSearchEngineAutocomplete) => {
  return `${autocomplete.field}:${autocomplete.value}`;
};

export const textSearchAutocompleteFromKey = (key: string) => {
  const [field, value] = key.split(":", 2);
  return {field, value};
};
