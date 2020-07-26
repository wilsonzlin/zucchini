import {callHandler, EventHandler} from 'common/Event';
import {Tile} from 'component/Browser/TileView/Tile/view';
import {File, Photo, Video} from 'model/Listing';
import React from 'react';
import style from './style.scss';

const TILE_MIN_ROW_HEIGHT = 210;
const TILE_MARGIN = 5;

export const Tiles = ({
  containerWidth,
  files,
  onRequestPlayFiles,
}: {
  containerWidth: number;
  files: (Photo | Video)[];
  onRequestPlayFiles?: EventHandler<[File[], File]>;
}) => {
  const queue = files.slice();
  const rows = [];
  while (queue.length) {
    const row = [];
    let rowHeight = 0;
    while (true) {
      const listing = queue.shift();
      if (!listing) {
        break;
      }
      row.push(listing);
      rowHeight = (containerWidth - (TILE_MARGIN + 1) * (Math.max(0, row.length - 1)))
        / row.reduce((base, {width, height}) => base + width / height, 0);
      if (rowHeight < TILE_MIN_ROW_HEIGHT) {
        break;
      }
    }
    rowHeight = Math.min(TILE_MIN_ROW_HEIGHT, rowHeight);

    rows.push(
      <div className={style.tilesRow}>
        {row.map((f, i) => (
          <Tile
            key={f.id}

            height={rowHeight}
            width={f.width / f.height * rowHeight}
            marginRight={i == row.length - 1 ? 0 : TILE_MARGIN}

            name={f.title}
            thumbnailUrl={f.thumbnail}

            onClick={() => callHandler(onRequestPlayFiles, [files, f])}
          />
        ))}
      </div>,
    );
  }
  return (
    <div>
      {rows}
    </div>
  );
};
