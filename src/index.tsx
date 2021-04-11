import React, { ReactElement } from 'react';

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
import { AxiosError } from 'axios';

export * from './interfaces';
export * from './Event';
export * from './Key';
export * from './utils';

export interface OfflineCalendarProps {
  events: { [timestamp: number]: CalendarEvent[] }
  calendars: {[color: string]: string} /* Map colours to names */
  settings?: undefined
}
export interface OnlineCalendarProps {
  settings: CalendarSettings
  events?: undefined
  calendars: {[key: string]: string} /* Map IDs to colours */
}
export interface CalendarProps {
  start: Date
  finish?: Date
  title?: string
  timeZone?: string
  onError?: (e: AxiosError) => void

  classNames?: {[key: string]: string}
  noUpdateHash?: boolean
  customLinkComponent?: ((...args: any[]) => JSX.Element)
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
    timeZone: props.timeZone,
    events: props.events,
    APIkey: props.settings?.APIkey,
    onError: props.onError
  });

  return (
    <Contexts values={[
      [CalendarSettingsContext, props.settings || { locationReplacers: {} }],
      [LinkComponentContext, props.customLinkComponent || null]
    ]}>
      <CalendarKey colorNames={'events' in props ? props.calendars : colors} colorStatuses={colorStatuses} updateColorStatuses={toggleColor} classNames={props.classNames} />
      <CalendarFrame {...{ events, colorStatuses }} {...props} maxEvents={3} colorNames={'events' in props ? props.calendars : colors} />
    </Contexts>
  );

}