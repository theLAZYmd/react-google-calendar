var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { CalendarSettingsContext } from '../contexts';
import { CalendarEvent } from '../Event';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getEventDate } from '../utils';
const baseURL = 'https://clients6.google.com/calendar/v3/calendars/';
const defaultTimeZone = 'Europe/London';
export default function useEvents(props) {
    const [events, setEvents] = useState({});
    const [colors, setColors] = useState({}); /* calendarName */
    const settings = useContext(CalendarSettingsContext);
    const handleId = useCallback((calendarId) => __awaiter(this, void 0, void 0, function* () {
        let eventDict = events;
        let c = colors;
        let res = yield axios({
            baseURL: settings.baseURL || baseURL,
            url: calendarId + '/events',
            params: {
                calendarId,
                singleEvents: true,
                timeZone: props.timeZone || defaultTimeZone,
                maxAttendees: 1,
                maxResults: 250,
                sanitizeHtml: true,
                timeMin: new Date(props.start).toISOString(),
                timeMax: new Date(props.finish || Date.now()).toISOString(),
                key: settings.APIkey
            }
        });
        let { data } = res;
        let calendarName = data.summary;
        let eventArr = [];
        data.items.forEach((event) => {
            let color = props.calendars[calendarId];
            if (!c[color])
                c[color] = calendarName;
            eventArr.push(new CalendarEvent(event, calendarName, color, settings));
        });
        eventArr.forEach((event) => {
            let date = getEventDate(event.start);
            if (!eventDict[date])
                eventDict[date] = [];
            eventDict[date].push(event);
        });
        props.setColorStatuses(Object.keys(c));
        setColors(c);
        setEvents(eventDict);
    }), [events, colors, settings, setEvents, setColors, props]);
    useEffect(() => {
        Object.keys(props.calendars).forEach(handleId);
    }, [props.calendars]);
    return { colors, events };
}
//# sourceMappingURL=useEvents.js.map