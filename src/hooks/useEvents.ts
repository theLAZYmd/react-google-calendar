import axios, { AxiosError, AxiosResponse } from 'axios';
import { CalendarSettingsContext } from '../contexts';
import { CalendarEvent } from '../Event';
import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { getEventDate } from '../utils';
import { GoogleCalendar } from '../interfaces';

const baseURL = 'https://clients6.google.com/calendar/v3/calendars/';
const defaultTimeZone = 'Europe/London';
interface EventHookProps {
  calendars: {[key: string]: string}
  setColorStatuses: (colors: string[]) => void
  start: Date
  finish?: Date
  timeZone?: string
  events?: {
    [timestamp: number]: CalendarEvent[]
  }
  APIkey?: string
  onError?: (e: AxiosError) => void
}

export default function useEvents(props: EventHookProps) {

  const [events, setEvents] = useReducer((state: typeof props.events, action: typeof props.events) => {
	  return Object.assign({}, state, action);
  }, props.events || {});

  const [colors, updateColors] = useReducer((state: {[color: string]: string}, action: {[key: string]: CalendarEvent[]}) => {
	let c = Object.assign({}, state);
    for (let eventArr of Object.values(action)) {
      for (let e of eventArr) {
        if (!c[e.color]) c[e.color] = e.calendarName;
      }
    }
    props.setColorStatuses(Object.keys(c));
    return c;
  }, {}); /* calendarName */

  const settings = useContext(CalendarSettingsContext);

  const handleId = useCallback(async (calendarId: string) => {
    let eventDict = Object.assign({}, events);
    
    let res = await axios({
      baseURL: settings.baseURL || baseURL,
      url: calendarId + '/events',
      params: {
        calendarId,
        singleEvents: true,
        timeZone: props.timeZone || defaultTimeZone,
        maxAttendees: 1,
        maxResults: 250,
        sanitizeHtml: true,
        timeMin: new Date(props.start).toISOString(), //'2019-10-27T00:00:00Z',
        timeMax: new Date(props.finish || Date.now()).toISOString(), //'2019-12-01T00:00:00Z',
        key: props.APIkey
      }
    }).catch((e) => {
      if (props.onError) props.onError(e);
      else throw e;
    }) as AxiosResponse<GoogleCalendar>;
    let { data } = res;
    let calendarName = data.summary;
    let eventArr = [] as CalendarEvent[];
    data.items.forEach((event) => {
      let color = props.calendars[calendarId];
      eventArr.push(new CalendarEvent(event, calendarName, color, settings));
    });
    eventArr.forEach((event) => {
      let date = getEventDate(event.start);
      if (!eventDict[date]) eventDict[date] = [];
      eventDict[date].push(event);
    });
    setEvents(eventDict);
  }, [events, colors, settings, setEvents, props]);

  useEffect(() => {
    Object.entries(props.calendars).forEach(([k, v]) => {
      if (k === v) return;
      handleId(k);
    });
  }, [props.calendars]);

  useEffect(() => {
    if (!Object.keys(events).length) return;
    updateColors(events);
  }, [events, updateColors]);

  return { colors, events };

}