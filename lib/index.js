import React from 'react';
import { CalendarKey } from './Key';
import { CalendarFrame } from './Frame';
import Contexts, { CalendarSettingsContext, LinkComponentContext } from './contexts';
import { useReducer } from 'react';
import useEvents from './hooks/useEvents';
import { useEffect } from 'react';
import { getEventDate, updateHash } from './utils';
import { useMemo } from 'react';
export * from './interfaces';
export * from './Event';
export * from './Key';
export * from './utils';
export default function Calendar(props) {
    useEffect(() => {
        if (props.noUpdateHash)
            return;
        updateHash(getEventDate(Date.now()));
    }, [props.noUpdateHash]);
    const [colorStatuses, toggleColor] = useReducer((state, action) => {
        if (typeof action === 'string') {
            state[action] = !state[action];
            return Object.assign({}, state);
        }
        else {
            return action.reduce((acc, curr) => {
                acc[curr] = true;
                return acc;
            }, {});
        }
    }, {});
    const calendars = useMemo(() => {
        if ('events' in props) {
            return Object.entries(props.calendars).reduce((acc, curr) => {
                acc[curr[0]] = curr[0];
                return acc;
            }, {});
        }
        else {
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
    return (React.createElement(Contexts, { values: [
            [CalendarSettingsContext, props.settings || { locationReplacers: {} }],
            [LinkComponentContext, props.customLinkComponent || null]
        ] },
        React.createElement(CalendarKey, { colorNames: 'events' in props ? props.calendars : colors, colorStatuses: colorStatuses, updateColorStatuses: toggleColor }),
        React.createElement(CalendarFrame, Object.assign({}, { events, colorStatuses }, props))));
}
//# sourceMappingURL=index.js.map