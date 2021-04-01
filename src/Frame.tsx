import React from 'react';
import cx from 'classnames';

import { CalendarEvent } from './Event';
import { getDisplayTime, getEventDate } from './utils';
import { useMemo } from 'react';
const defaultStyles = require('./css/frame.module.css');

const defaultDayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const defaultWeeks = 4;

export interface CalendarFrameProps {
  events: {
    [timestamp: number]: CalendarEvent[]
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
  startIndex?: number | string
}

export function CalendarFrame(props: CalendarFrameProps) {

  const days = props.dayLabels || defaultDayLabels;
  const startIndex = typeof props.startIndex === 'string' ?
    days.indexOf(props.startIndex) : 
    props.startIndex || 0;
    
  const styles = useMemo(() => {
    let s = Object.assign({}, defaultStyles);
    for (let [k, v] of Object.entries(props.classNames || {})) {
      s[k] += ' ' + v;
    }
    return s;
  }, []);

  const weeks = useMemo(() => {
    let w = [] as Date[];
    for (let i = 0; i < (props.weeks || defaultWeeks); i++) {
      let curr = new Date(props.start);
      curr.setDate(curr.getDate() + days.length * i);
      weeks.push(curr);
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
                    props.events[timestamp]
                      .sort((a, b) => {
                        if (a.start.getHours() !== b.start.getHours()) return a.start.getHours() - b.start.getHours();
                        else return a.start.getMinutes() - b.start.getMinutes();
                      })
                      .map((event, i) => {
                        return (
                          <div className={styles.event} key={[timestamp, i].join('.')} style={colorStatuses[event.color] ? {} : {
                            display: 'none'
                          }}>
                            <div className={styles.eventHeader}>
                              <h4 className={styles.eventName}>
                                <span className={styles.status} style={{
                                  color: event.color
                                }}>⬤</span>
                                <span className='toolTip'>{/* TODO */}</span>
                                {event.facebookEvent ?
                                  <a className={styles.eventTitle} href={event.facebookEvent}>
                                    {event.title}
                                  </a> :
                                  event.title
                                }
                              </h4>
                            </div>
                            {<div>
                              <h5>
                                {getDisplayTime(event.start)}
                                {' '}
                                {event.map ?
                                  <a href={event.map} rel='noopener noreferrer' target='_blank'>
                                    {event.location}
                                  </a>
                                  : event.location}
                                {'\n'}
                                {event.description || null}
                              </h5>
                            </div>}
                          </div>
                        );
                      }) :
                    <div className={styles.dateNumber}>
                      {date.getDate()}
                    </div>}
                </div>
              </td>
            );
            days.push(day);
          }
          return <tr key={'week.' + i}>
            <th scope='row' className={styles.firstColumn}>
              {'Week ' + i + '\n' + week.toDateString().slice(4, 10)}
            </th>
            {days}            
          </tr>;
        })}
      </tbody>
    </table>
  );

}