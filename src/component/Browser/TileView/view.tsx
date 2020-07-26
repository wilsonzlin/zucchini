import {callHandler, EventHandler} from 'common/Event';
import {Tiles} from 'component/Browser/TileView/Tiles/view';
import {assertExists} from 'extlib/js/optional/assert';
import {File, isDir, isPhotoOrVideo, Listing} from 'model/Listing';
import React, {useState} from 'react';
import Measure from 'react-measure';
import {Button} from 'ui/Button/view';
import style from './style.scss';

export const TileView = ({
  entries,
  hasContinuation,

  onOpenFolder,
  onRequestPlayFiles,
}: {
  entries: Listing[];
  hasContinuation: boolean;

  onOpenFolder?: EventHandler<string>;
  onRequestPlayFiles?: EventHandler<[File[], File]>;
}) => {
  const [tilesContainerWidth, setTilesContainerWidth] = useState<number>(0);

  return (
    <div className={style.view}>
      <div className={style.dirs}>
        {entries.filter(isDir).map(d => (
          <div
            className={style.dir}
            onClick={() => callHandler(onOpenFolder, d.name)}
          >{d.name}</div>
        ))}
      </div>
      <Measure bounds onResize={rect => setTilesContainerWidth(assertExists(rect.bounds).width)}>
        {({measureRef}) => (
          <div className={style.tilesContainer} ref={measureRef}>
            <Tiles
              containerWidth={tilesContainerWidth}
              files={entries.filter(isPhotoOrVideo)}
              onRequestPlayFiles={onRequestPlayFiles}
            />
          </div>
        )}
      </Measure>
      {hasContinuation && (
        <Button>More&hellip;</Button>
      )}
    </div>
  );
};
