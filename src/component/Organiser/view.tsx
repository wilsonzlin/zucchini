import {cls} from 'common/Classes';
import {callHandler, EventHandler} from 'common/Event';
import {Field} from 'model/Song';
import moment from 'moment';
import React from 'react';
import {IconButton} from 'ui/Button/view';
import {Dropdown} from 'ui/Dropdown/view';
import {HoverCard, HoverCardAnchor} from 'ui/HoverCard/view';
import {Input} from 'ui/Input/view';
import {useDismissible} from 'ui/util/dismissible';
import {SettingsIcon} from '../Icon/view';
import style from './style.scss';

const createOptions = (fields: (Field | undefined)[], labels: Map<Field | undefined, string>) => fields.map(f => ({
  value: f,
  label: labels.get(f)!,
}));

export const Organiser = ({
  statistics,

  filterBy,
  filterOn,
  groupBy,
  subgroupBy,

  filterByOptions,
  filterByOptionLabels,
  groupByOptions,
  groupByOptionLabels,
  subgroupByOptions,
  subgroupByOptionLabels,

  onChangeFilterBy,
  onChangeFilterOn,
  onChangeGroupBy,
  onChangeSubgroupBy,
}: {
  // This are optional, as songs may not be loaded.
  statistics?: {
    count: number;
    duration: number;
  };

  filterBy?: Field;
  filterOn?: string;
  groupBy?: Field;
  subgroupBy?: Field;

  filterByOptions: (Field | undefined)[];
  filterByOptionLabels: Map<Field | undefined, string>;
  groupByOptions: (Field | undefined)[];
  groupByOptionLabels: Map<Field | undefined, string>;
  subgroupByOptions: (Field | undefined)[];
  subgroupByOptionLabels: Map<Field | undefined, string>;

  onChangeFilterBy?: EventHandler<Field | undefined>;
  onChangeFilterOn?: EventHandler<string>;
  onChangeGroupBy?: EventHandler<Field | undefined>;
  onChangeSubgroupBy?: EventHandler<Field | undefined>;
}) => {
  const [showingOptions, setShowingOptions, onRelevantOptionsClick, onRelevantOptionsFocus] = useDismissible();

  return (
    <div className={style.organiser}>
      <aside className={style.labelContainer}>
        {/* This is necessary as .labelContainer uses flex to centre vertically, but we want natural
        space between text and button to be rendered, which would not be if container is flex. */}
        <span>
        {/* Coerce count to boolean to prevent rendering if zero. */}
          {statistics && !!statistics.count && (
            /* Wrap text to allow flex for center-right alignment. */
            <span className={style.labelText}>
            {statistics.count} songs
              {' • '}
              {moment.duration(statistics.duration, 's').humanize()}
          </span>
          )}
          <IconButton
            className={cls(
              style.optionsButton,
              filterBy || groupBy ? style.optionsButtonActive : undefined,
            )}
            onClick={() => {
              onRelevantOptionsClick();
              setShowingOptions(!showingOptions);
            }}
          >{SettingsIcon}</IconButton>
        </span>
      </aside>

      <div
        hidden={!showingOptions}
        onClick={onRelevantOptionsClick}
        onFocusCapture={onRelevantOptionsFocus}
      >
        <HoverCard
          anchor={HoverCardAnchor.BOTTOM}
          className={style.options}
          shouldShow={true}
        >
          <div className={style.optionsRow}>
            <label>Use </label>
            <Dropdown
              options={createOptions(filterByOptions, filterByOptionLabels)}
              value={filterBy}
              onChange={e => callHandler(onChangeFilterBy, e)}
            />
            {filterBy && <Input
              value={filterOn || ''}
              onChange={e => callHandler(onChangeFilterOn, e)}
            />}
          </div>

          <div className={style.optionsRow}>
            <label>Group by </label>
            <Dropdown
              options={createOptions(groupByOptions, groupByOptionLabels)}
              value={groupBy}
              onChange={e => callHandler(onChangeGroupBy, e)}
            />
            {groupBy && (
              <>
                <label> then by </label>
                <Dropdown
                  options={createOptions(subgroupByOptions, subgroupByOptionLabels)}
                  value={subgroupBy}
                  onChange={e => callHandler(onChangeSubgroupBy, e)}
                />
              </>
            )}
          </div>
        </HoverCard>
      </div>
    </div>
  );
};
