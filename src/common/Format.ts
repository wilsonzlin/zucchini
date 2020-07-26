import {exists} from 'extlib/js/optional/pred';
import {escapeRegExp} from 'extlib/js/regexp/escape';

export const plural = (format: string, values: number | { [delimiter: string]: number }) => {
  if (typeof values == 'number') {
    values = {
      '{}': values,
    };
  }
  let result = format;
  for (const [valSub, value] of Object.entries(values)) {
    const isPlural = value != 1;
    const valSubRegex = new RegExp(escapeRegExp(valSub), 'g');
    const pluralSwitchRegex = new RegExp(`\\${valSub[0]}(.*?):(.*?)\\${valSub[1]}`, 'g');
    result = result
      .replace(valSubRegex, `${value}`)
      .replace(pluralSwitchRegex, (_, singular, plural) => isPlural ? plural : singular);
  }
  return result;
};

const round = (val: number, prec: number) => (Math.round(val * 10 ** prec) / 10 ** prec).toFixed(prec);

const number = (val: string) => {
  const [int, dec] = val.split('.');
  const parts = [];
  for (let i = int.length; i > 0; i -= 3) {
    parts.unshift(int.slice(Math.max(0, i - 3), i));
  }
  return [parts.join(','), dec].filter(exists).join('.');
};

const createRoundingFormatter = (units: [number, string][], defaultPrec: number = 2) =>
  (val: number, prec: number = defaultPrec) => {
    for (const [limit, suffix] of units.slice(0, -1)) {
      if (val < limit) {
        return `${number(round(val, prec))} ${suffix}`;
      }
      val /= limit;
    }
    return `${number(round(val, prec))} ${units[units.length - 1][1]}`;
  };

export const bytes = createRoundingFormatter([
  [1024, 'B'], [1024, 'KB'], [1024, 'MB'], [1024, 'GB'], [1024, 'TB'], [1024, 'PB'],
]);

export const duration = createRoundingFormatter([
  [60, 'seconds'], [60, 'minutes'], [24, 'hours'],
], 0);
