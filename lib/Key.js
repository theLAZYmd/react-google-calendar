import React from 'react';
import { useMemo } from 'react';
export function CalendarKey(props) {
    var styles = useMemo(function () {
        var s = {};
        for (var _i = 0, _a = Object.entries(props.classNames || {}); _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], v = _b[1];
            s[k] = k + ' ' + v;
        }
        return s;
    }, [props.classNames]);
    var colorStatuses = props.colorStatuses || {};
    var sorted = Object.entries(props.colorNames).sort(function (a, b) {
        if (a[1] < b[1])
            return -1;
        else if (a[1] > b[1])
            return 1;
        else
            return 0;
    });
    return (React.createElement("div", { className: styles.key }, sorted.map(function (_a, i) {
        var color = _a[0], calendarName = _a[1];
        return React.createElement("div", { className: styles.key, key: ['keyElement', i].join('.') },
            React.createElement("span", { className: styles.status, onClick: function () { return props.updateColorStatuses(color); }, style: { color: color } }, colorStatuses[color] ?
                '\u2b24' :
                '\u2b58'),
            React.createElement("h4", null, '\u200b ' + calendarName));
    })));
}
//# sourceMappingURL=Key.js.map