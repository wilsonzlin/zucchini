import {callHandler, EventHandler} from "common/Event";
import {Field} from "model/Song";
import * as moment from "moment";
import * as React from "react";
import {Dropdown} from "ui/Dropdown/view";
import {HoverCard, HoverCardAnchor} from "ui/HoverCard/view";
import {Input} from "ui/Input/view";
import * as style from "./style.scss";

const createOptions = (fields: (Field | undefined)[], labels: Map<Field | undefined, string>) => fields.map(f => ({
  value: f,
  label: labels.get(f)!,
}));

export interface OrganiserProps {
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
}

export const Organiser = (
  {
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
  }: OrganiserProps
) => (
  <div className={style.organiser}>
    <aside className={style.organiserLabel}>
      {statistics && (
        <>
          <span>{statistics.count} songs</span>
          <span>{moment.duration(statistics.duration, "s").humanize()}</span>
        </>
      )}
    </aside>

    <HoverCard shouldShow={true} anchor={HoverCardAnchor.BOTTOM}>

      <form className={style.organiserOptions}>
        <span>Showing</span>
        <Dropdown
          options={createOptions(filterByOptions, filterByOptionLabels)}
          value={filterBy}
          onChange={e => callHandler(onChangeFilterBy, e)}
        />
        {filterBy && <Input
          value={filterOn || ""}
          onChange={e => callHandler(onChangeFilterOn, e)}
        />}

        <Dropdown
          options={createOptions(groupByOptions, groupByOptionLabels)}
          value={groupBy}
          onChange={e => callHandler(onChangeGroupBy, e)}
        />

        {groupBy && <Dropdown
          options={createOptions(subgroupByOptions, subgroupByOptionLabels)}
          value={subgroupBy}
          onChange={e => callHandler(onChangeSubgroupBy, e)}
        />}
      </form>
    </HoverCard>
  </div>
);
