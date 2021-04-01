import axios, { AxiosResponse } from 'axios';
import { CalendarSettingsContext } from '../contexts';
import { CalendarEvent } from '../Event';
import { useCallback, useContext, useEffect, useState } from 'react';
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
}

export default function useEvents(props: EventHookProps) {

  const [events, setEvents] = useState(props.events || {});
  const [colors, setColors] = useState({} as {[color: string]: string}); /* calendarName */

  const settings = useContext(CalendarSettingsContext);

  const handleId = useCallback(async (calendarId: string) => {
    let eventDict = events;
    
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
        key: settings.APIkey
      }
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

  const parseColorsFromEvents = useCallback((eventDict: {[key: string]: CalendarEvent[]}) => {
    let c = colors;
    for (let eventArr of Object.values(eventDict)) {
      for (let e of eventArr) {
        if (!c[e.color]) c[e.color] = e.calendarName;
      }
    }
    console.log(c);
    setColors(c);
    props.setColorStatuses(Object.keys(c));
  }, [setColors, props.setColorStatuses]);

  useEffect(() => {
    Object.entries(props.calendars).forEach(([k, v]) => {
      if (k === v) return;
      handleId(k);
    });
  }, [props.calendars]);

  useEffect(() => {
    if (props.events) setEvents(props.events);
  }, [setEvents, props.events]);

  useEffect(() => {
    if (!Object.keys(events).length) return;
    parseColorsFromEvents(events);
  }, [events, parseColorsFromEvents]);

  return { colors, events };

}