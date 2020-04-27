import {DEFAULT_DENSITY, DEFAULT_THEME} from 'component/App/config';
import {observable} from 'mobx';

export class AppStore {
  // TODO
  @observable selectedTheme: string = DEFAULT_THEME;
  @observable selectedDensity: string = DEFAULT_DENSITY;
}
