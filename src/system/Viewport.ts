import {action, computed, observable} from 'mobx';

export const getViewportWidth = () => {
  return document.documentElement.clientWidth;
};

export enum ViewportMode {
  SMALL = 'small',
  LARGE = 'large',
}

class Viewport {
  // @ts-ignore
  @observable private proxyMode: ViewportMode;

  @computed get mode () {
    return this.proxyMode;
  }

  @action private updateMode = () => {
    const width = getViewportWidth();
    const mode = width < 768 ? ViewportMode.SMALL : ViewportMode.LARGE;
    this.proxyMode = mode;
    document.body.setAttribute('vm', mode);
  };

  constructor () {
    this.updateMode();
    window.addEventListener('resize', this.updateMode);
    window.addEventListener('orientationchange', this.updateMode);
  }
}

export const viewport = new Viewport();
