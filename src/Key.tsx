import React from 'react';
import { useMemo } from 'react';
const defaultStyles = require('./css/key.module.css');

export interface CalendarKeyProps {
  classNames?: {
    [key: string]: string
  }
  colorNames: {
    [color: string]: string /* calendarName */
  }
  updateColorStatuses: (color: string) => void
  colorStatuses: {
    [color: string]: boolean
  }
}

export function CalendarKey(props: CalendarKeyProps) {
    
  const styles = useMemo(() => {
    let s = Object.assign({}, defaultStyles);
    for (let [k, v] of Object.entries(props.classNames || {})) {
      s[k] += ' ' + v;
    }
    return s;
  }, []);

  const colorStatuses = props.colorStatuses || {};

  let sorted = Object.entries(props.colorNames).sort((a, b) => {
    if (a[1] < b[1]) return -1;
    else if (a[1] > b[1]) return 1;
    else return 0;
  });

  return (
    <div className={styles.key}>
      {sorted.map(([color, calendarName], i) => {
        return <div className={styles.key} key={['keyElement', i].join('.')}>
          <span className={styles.status} onClick={() => props.updateColorStatuses(color)} style={{ color }}>
            {colorStatuses[color] ?
              '\u2b24' :
              '\u2b58'
            }
          </span>
          <h4>
            {'\u200b ' + calendarName}
          </h4>
        </div>;
      })}
    </div>
  );
}