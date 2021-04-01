import React from 'react';
import { CalendarKey } from './Key';
import { CalendarFrame } from './Frame';
import Contexts, { CalendarSettingsContext, LinkComponentContext } from './contexts';
import { useReducer } from 'react';
import useEvents from './hooks/useEvents';
import { useEffect } from 'react';
import { getEventDate, updateHash } from './utils';
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
    const { colors, events } = useEvents({
        calendars: props.calendars,
        setColorStatuses: toggleColor,
        start: props.start,
        finish: props.finish,
        timeZone: props.timeZone
    });
    return (React.createElement(Contexts, { values: [
            [CalendarSettingsContext, props.settings],
            [LinkComponentContext, props.customLinkComponent || null]
        ] },
        React.createElement(CalendarKey, { colorNames: colors, colorStatuses: colorStatuses, updateColorStatuses: toggleColor }),
        React.createElement(CalendarFrame, Object.assign({}, { events, colorStatuses }, props))));
}
//# sourceMappingURL=index.js.map