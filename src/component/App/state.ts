import {AppLSKey, STRING_CODEC} from 'common/LocalStorage';
import {DEFAULT_DENSITY, DEFAULT_THEME} from 'component/App/config';
import {computed, observable} from 'mobx';

const THEME = new AppLSKey('theme', STRING_CODEC);
const DENSITY = new AppLSKey('density', STRING_CODEC);

export class AppStore {
  @observable selectedTheme: string = THEME.getOrDefault(DEFAULT_THEME);
  @observable selectedDensity: string = DENSITY.getOrDefault(DEFAULT_DENSITY);

  @observable private proxyViewportWidth: number = -1;
  @observable private proxyViewportHeight: number = -1;

  constructor () {
    window.addEventListener('resize', this.updateProxyViewportDimensions);
    window.addEventListener('orientationchange', this.updateProxyViewportDimensions);
  }

  @computed get viewportWidth () {
    return this.proxyViewportWidth;
  }

  @computed get viewportHeight () {
    return this.proxyViewportHeight;
  }

  private updateProxyViewportDimensions = () => {
    this.proxyViewportWidth = document.documentElement.clientWidth;
    this.proxyViewportHeight = document.documentElement.clientHeight;
  };
}
