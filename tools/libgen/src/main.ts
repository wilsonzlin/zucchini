#!/usr/bin/env node

import {exec} from 'child_process';
import fs from 'fs';
import Path from 'path';
import minimist from 'minimist';

/**
 * Take a semicolon-separated string, split by semicolon, trim each part, and filter out any empty parts.
 *
 * @param val semicolon-separated string
 * @return array of non-empty trimmed strings
 */
const splitDelimited = (val: string = ''): string[] =>
  val.split(';').map(l => l.trim()).filter(l => l);

/**
 * If {@param val} is an empty string, `null`, or `undefined`, return null.
 * Otherwise, return the result of calling {@param producer} with {@param val}.
 *
 * In essence, this function normalises {@param val} if it's an emtpy string, `null` or `undefined` to `null`,
 * and maps it to a different value (which could be a different type) using {@param producer} otherwise.
 *
 * @param val a value
 * @param producer function to call that takes a non-`undefined` non-`null` non-empty-string {@param val}
 * @return `null` or the return value of {@param producer}
 */
const computeIfPresent = <T, R>(val: T | null | undefined, producer: (val: T) => R): R | null =>
  val == null || (val as any) === '' ? null : producer(val);

export interface FileMetadata {
  file: string;
  duration: number;
  album: string | null;
  artists: string[];
  genres: string[];
  title: string | null;
  track: number | null;
  year: number | null;
  decade: string | null;
}

export const getMetadata = (path: string, prefix: string = ''): Promise<FileMetadata> =>
  new Promise((resolve, reject) => {
    const file = Path.basename(path);

    exec(`ffprobe -hide_banner -show_entries format=duration "${path}" 2>&1`, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      // There should be no stderr output.
      if (stderr) {
        return reject(new Error(`stderr: ${stderr}`));
      }

      const duration = +/^duration=([0-9.]+)$/m.exec(stdout)![1];

      const pairs: { [field: string]: string } = Object.assign({}, ...stdout
        .split(/[\r\n]+/)
        .map(line => /^([A-Za-z0-9-_]+)\s+:\s+(.*)$/.exec(line.trim()))
        .filter(m => m)
        .map(m => ({[m![1]]: m![2]})));

      const data = {
        file: `${prefix}${file}`,
        duration: duration,
        album: pairs.album || null,
        artists: splitDelimited(pairs.artist || pairs.album_artist),
        genres: splitDelimited(pairs.genre),
        title: pairs.title || null,
        track: computeIfPresent(pairs.track, track => Number.parseInt(track, 10)),
        year: computeIfPresent(pairs.date, date => Number.parseInt(date, 10)),
        decade: computeIfPresent(pairs.date, date => `${date.slice(0, 3)}0`),
      };

      resolve(data);
    });
  });

if (require.main === module) {
  const args = minimist(process.argv.slice(2));

  const dir = args.dir;
  const prefix = args.prefix;

  const files = fs.readdirSync(dir);
  Promise.all(files.map(f => getMetadata(Path.join(dir, f), prefix)))
    .then(res => {
      console.log(JSON.stringify(res, null, 2));
    });
}
