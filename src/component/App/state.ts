import {AppLSKey, STRING_CODEC} from "common/LocalStorage";
import {DEFAULT_DENSITY, DEFAULT_THEME} from "component/App/config";
import {observable} from "mobx";

const THEME = new AppLSKey("theme", STRING_CODEC);
const DENSITY = new AppLSKey("density", STRING_CODEC);

export class AppStore {
  @observable selectedTheme: string = THEME.getOrDefault(DEFAULT_THEME);
  @observable selectedDensity: string = DENSITY.getOrDefault(DEFAULT_DENSITY);
}
