import Modern from "!!raw-loader!./theme/Modern.css";
import Monokai from "!!raw-loader!./theme/Monokai.css";
import Clear from "!!raw-loader!./density/Clear.css";
import Comfortable from "!!raw-loader!./density/Comfortable.css";
import Compact from "!!raw-loader!./density/Compact.css";

export const Themes = {
  Modern,
  Monokai,
};

export const DEFAULT_THEME = "Modern";

export const Densities = {
  Clear,
  Comfortable,
  Compact,
};

export const DEFAULT_DENSITY = "Clear";
