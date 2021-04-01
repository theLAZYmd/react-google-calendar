import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { LinkComponentContext } from './contexts';
import { CalendarEvent } from './Event';
import { getDisplayTime } from './utils';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

export default function Cell({ maxEvents, styles, events, colorStatuses, colorNames }: {
  maxEvents: number
  styles: {[key: string]: string}
  events: CalendarEvent[]
  colorStatuses: {[key: string]: boolean}
  colorNames: {[key: string]: string}
}) {

  const Link = useContext(LinkComponentContext);
  const [isExpanded, expand] = useState(false);

  return <>
    {events.sort((a, b) => {
      if (a.start.getHours() !== b.start.getHours()) return a.start.getHours() - b.start.getHours();
      else return a.start.getMinutes() - b.start.getMinutes();
    })
      .map((event, i, arr) => {
        if (i === maxEvents && !isExpanded) {
          return <div key='overflowMessage' className={styles.overflowMessage} onClick={() => expand(true)}>
            <h4><FaPlusCircle />{arr.length - maxEvents} more</h4>
          </div>;
        }
        if (i > maxEvents && !isExpanded) return null;
        return <React.Fragment key={'cell.' + i}>
          <div className={cx(styles.event, {
            [styles.hidden]: !colorStatuses[event.color]
          })}>
            <div className={styles.eventHeader}>
              <h4 className={styles.eventName}>
                <span className={styles.status} title={colorNames[event.color]} style={{
                  color: event.color
                }}>⬤</span>
                <span className='toolTip'>{/* TODO */}</span>
                {event.facebookEvent || event.link ?
                  Link ?
                    <Link className={styles.eventTitle} href={event.facebookEvent || event.link}>
                      {event.title}
                    </Link> :
                    <a className={styles.eventTitle} href={event.facebookEvent || event.link}>
                      {event.title}
                    </a> :
                  event.title
                }
              </h4>
            </div>
            <div>
              <h5>
                {getDisplayTime(event.start)}
                {' '}
                {event.map ?
                  Link ?
                    <Link href={event.map}>
                      {event.location}
                    </Link> :
                    <a href={event.map} rel='noopener noreferrer' target='_blank'>
                      {event.location}
                    </a>
                  : event.location}
                <br />
                {event.description || null}
              </h5>
            </div>
          </div>
          {(i === arr.length - 1) && isExpanded ?
            <div className={styles.overflowMessage} onClick={() => expand(false)}>
              <h4><FaMinusCircle />Show less</h4>
            </div> :
            null
          }
        </React.Fragment>;
      })}
  </>;

}