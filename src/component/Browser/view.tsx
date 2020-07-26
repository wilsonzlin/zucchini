import {callHandler, EventHandler} from 'common/Event';
import {bytes, duration, plural} from 'common/Format';
import {TileView} from 'component/Browser/TileView/view';
import {cls} from 'extlib/js/dom/classname';
import {mapDefined} from 'extlib/js/optional/map';
import {emptySplit} from 'extlib/js/string/split';
import {File, Listing} from 'model/Listing';
import React from 'react';
import {Dropdown} from 'ui/Dropdown/view';
import {Columns} from './ListView/config';
import {ListView} from './ListView/view';
import {BrowserViewMode} from './state';
import style from './style.scss';

export const Browser = ({
  currentPath,
  onJumpToFolder,
  Search,

  approximateSize,
  approximateDuration,
  approximateCount,

  viewMode,

  loading,
  error,

  ...viewProps
}: {
  currentPath: string[];
  onJumpToFolder?: EventHandler<string[]>;
  Search: () => JSX.Element,

  approximateCount?: number;
  approximateDuration?: number;
  approximateSize?: number;

  loading: boolean;
  error?: string;

  viewMode: BrowserViewMode;
  entries: Listing[];
  hasContinuation: boolean;

  onOpenFolder?: EventHandler<string>;
  onRequestPlayFiles?: EventHandler<[File[], File]>;
}) => (
  <div className={style.container}>
    <div className={style.toolbar}>
      <div className={style.path}>
        <Dropdown
          options={[
            ...currentPath.map((c, i) => ({
              value: currentPath.slice(0, i + 1).join('/'),
              label: c,
            })).reverse(),
            {value: '', label: '/'},
          ]}
          value={currentPath.join('/')}
          onChange={p => callHandler(onJumpToFolder, emptySplit(p, '/'))}
        />
      </div>
      <div className={style.search}>
        <Search/>
      </div>
      <div className={style.stats}>
        {[
          mapDefined(approximateCount, c => `${c} ${plural('file{:s}', c)}`),
          mapDefined(approximateDuration, d => duration(d)),
          mapDefined(approximateSize, s => bytes(s)),
        ].join(', ')}
      </div>
    </div>

    <div className={cls(style.loadingContainer, loading && style.isLoading)}>
      <div className={style.loadingBar}/>
    </div>

    {viewMode == BrowserViewMode.TILE ? (
      <TileView
        {...viewProps}
      />
    ) : (
      <ListView
        columns={Columns}
        {...viewProps}
      />
    )}
  </div>
);
