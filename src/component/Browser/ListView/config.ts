export type ListViewColumnDefinition = {
  field: string;
  label: string;
  width: number;
  align?: 'left' | 'center' | 'right';
};

export const Columns: ListViewColumnDefinition[] = [
  {field: 'track', label: '#', width: 5, align: 'right'},
  {field: 'title', label: 'Title', width: 30},
  {field: 'album', label: 'Album', width: 30},
  {field: 'artists', label: 'Artists', width: 25},
  {field: 'year', label: 'Year', width: 10},
];
