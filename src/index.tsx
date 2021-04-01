import React from 'react';

import { CalendarSettings } from './interfaces';

import { CalendarKey } from './Key';
import { CalendarFrame, CalendarFrameProps } from './Frame';
import Contexts, { CalendarSettingsContext, LinkComponentContext } from './contexts';
import { useReducer } from 'react';
import useEvents from './hooks/useEvents';
import { useEffect } from 'react';
import { getEventDate, updateHash } from './utils';
import { CalendarEvent } from './Event';
import { useMemo } from 'react';

export * from './interfaces';
export * from './Event';
export * from './Key';
export * from './utils';

export interface OfflineCalendarProps {
  events: { [timestamp: number]: CalendarEvent[] }
  calendars: {[color: string]: string} /* Map colours to names */
  settings: undefined
}
export interface OnlineCalendarProps {
  settings: CalendarSettings
  calendars: {[key: string]: string} /* Map IDs to colours */
}
export interface CalendarProps {
  start: Date
  finish?: Date
  title?: string
  timeZone?: string

  classNames?: {[key: string]: string}
  days?: string[]
  noUpdateHash?: boolean
  customLinkComponent?: React.Component
}

export default function Calendar(props: CalendarProps &
  Omit<CalendarFrameProps, 'events' | 'colorStatuses'> &
  (OfflineCalendarProps | OnlineCalendarProps)
) {

  useEffect(() => {
    if (props.noUpdateHash) return;
    updateHash(getEventDate(Date.now()));
  }, [props.noUpdateHash]);

  const [colorStatuses, toggleColor] = useReducer((state: {[color: string]: boolean}, action: string | string[]) => {
    if (typeof action === 'string') {
      state[action] = !state[action];
      return Object.assign({}, state);
    } else {
      return action.reduce((acc: {[color: string]: boolean}, curr: string) => {
        acc[curr] = true;
        return acc;
      }, {} as {[color: string]: boolean});
    }
  }, {});

  const calendars = useMemo(() => {
    if ('events' in props) {
      return Object.entries(props.calendars).reduce((acc, curr) => {
        acc[curr[0]] = curr[0];
        return acc;
      }, {} as {[key: string]: string});
    } else {
      return props.calendars;
    }
  }, [props.calendars]);

  const { colors, events } = useEvents({
    calendars,
    setColorStatuses: toggleColor,
    start: props.start,
    finish: props.finish,
    timeZone: props.timeZone
  });

  return (
    <Contexts values={[
      [CalendarSettingsContext, props.settings || { locationReplacers: {} }],
      [LinkComponentContext, props.customLinkComponent || null]
    ]}>
      <CalendarKey colorNames={'events' in props ? props.calendars : colors} colorStatuses={colorStatuses} updateColorStatuses={toggleColor} />
      <CalendarFrame {...{ events, colorStatuses }} {...props} />
    </Contexts>
  );

}