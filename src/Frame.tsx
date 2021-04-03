import React, { useContext } from 'react';
import cx from 'classnames';

import { CalendarEvent } from './Event';
import { getEventDate } from './utils';
import { useMemo } from 'react';
import Cell from './Cell';

const defaultDayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const defaultWeeks = 4;

export interface CalendarFrameProps {
  events: {
    [timestamp: number]: CalendarEvent[]
  }
  colorNames?: {
  [color: string]: string
  }
  colorStatuses?: {
    [color: string]: boolean
  }
  start: Date
  title?: string
  weeks?: number
  dayLabels?: string[]
  noHighlightToday?: boolean
  classNames?: {
    table?: string
    firstColumn?: string
    cell?: string
    event?: string
  }
  maxEvents?: number
}

export function CalendarFrame(props: CalendarFrameProps) {

  const days = props.dayLabels || defaultDayLabels;
  const startIndex = new Date(props.start).getDay();
  const maxEvents = props.maxEvents || 5;
    
  const styles = useMemo(() => {
    let s = {} as {[key: string]: string};
    for (let [k, v] of Object.entries(props.classNames || {})) {
      s[k] = k + ' ' + v;
    }
    return s;
  }, [props.classNames]);

  const weeks = useMemo(() => {
    let w = [] as Date[];
    for (let i = 0; i < (props.weeks || defaultWeeks); i++) {
      let curr = new Date(props.start);
      curr.setDate(curr.getDate() + days.length * i);
      w.push(curr);
    }
    return w;
  }, [props.start, props.weeks]);
  const colorStatuses = props.colorStatuses || {};
  
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {[props.title, ...days].map((day, i) => {
            return <th scope='column' key={day} className={i ? '' : styles.firstColumn}>
              {day}
            </th>;
          })}
        </tr>
      </thead>
      <tbody>            
        {weeks.map((week, i) => {
          let days = [];
          for (let i = 0; i < 7; i++) {
            let date = new Date(new Date(week).setDate(week.getDate() + i - startIndex));
            let timestamp = getEventDate(date);
            let today = getEventDate(Date.now()) === timestamp;
            let day = (
              <td id={timestamp.toString()} key={timestamp.toString()} className={cx(styles.cell, {
                [styles.today || '']: props.noHighlightToday !== false && today 
              })}>
                <div>
                  {props.events[timestamp] && !Object.values(props.events[timestamp]).every(e => !colorStatuses[e.color]) ?
                    <Cell
                      key={[timestamp, i].join('.')}
                      colorNames={props.colorNames as {[key: string]: string}}
                      events={props.events[timestamp]}
                      {...{ maxEvents, styles, timestamp, colorStatuses}}
                    /> :
                    <div className={styles.dateNumber}>
                      {date.getDate()}
                    </div>
                  }
                </div>
              </td>
            );
            days.push(day);
          }
          return <tr key={'week.' + i}>
            <th scope='row' className={styles.firstColumn}>
              {week.toDateString().slice(4, 10)}
            </th>
            {days}            
          </tr>;
        })}
      </tbody>
    </table>
  );

}