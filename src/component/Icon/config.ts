import {Field} from '../../model/Song';
import {AlbumIcon, ArtistIcon, GenreIcon, YearIcon} from './view';

export const FieldIcon: { [field in Field]?: string } = {
  genres: GenreIcon,
  album: AlbumIcon,
  artists: ArtistIcon,
  year: YearIcon,
  decade: YearIcon,
};
