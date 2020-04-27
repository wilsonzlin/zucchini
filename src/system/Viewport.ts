import {action, computed, observable} from 'mobx';

export const getViewportDimensions = () => {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
};

export enum ViewportMode {
  SMALL,
  LARGE,
}

class Viewport {
  // @ts-ignore
  @observable private proxyMode: ViewportMode;

  constructor () {
    this.updateMode();
    window.addEventListener('resize', this.updateMode);
    window.addEventListener('orientationchange', this.updateMode);
    window.addEventListener('fullscreenchange', this.updateMode);
  }

  @computed get mode () {
    return this.proxyMode;
  }

  @action private updateMode = () => {
    const {width, height} = getViewportDimensions();
    this.proxyMode = width < 768 || width < height ? ViewportMode.SMALL : ViewportMode.LARGE;
  };
}

export const viewport = new Viewport();
