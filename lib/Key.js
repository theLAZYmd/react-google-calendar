import React from 'react';
import { useMemo } from 'react';
export function CalendarKey(props) {
    const styles = useMemo(() => {
        let s = {};
        for (let [k, v] of Object.entries(props.classNames || {})) {
            s[k] += k + ' ' + v;
        }
        return s;
    }, []);
    const colorStatuses = props.colorStatuses || {};
    let sorted = Object.entries(props.colorNames).sort((a, b) => {
        if (a[1] < b[1])
            return -1;
        else if (a[1] > b[1])
            return 1;
        else
            return 0;
    });
    return (React.createElement("div", { className: styles.key }, sorted.map(([color, calendarName], i) => {
        return React.createElement("div", { className: styles.key, key: ['keyElement', i].join('.') },
            React.createElement("span", { className: styles.status, onClick: () => props.updateColorStatuses(color), style: { color } }, colorStatuses[color] ?
                '\u2b24' :
                '\u2b58'),
            React.createElement("h4", null, '\u200b ' + calendarName));
    })));
}
//# sourceMappingURL=Key.js.map