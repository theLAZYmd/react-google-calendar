var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import React from 'react';
import cx from 'classnames';
import { getEventDate } from './utils';
import { useMemo } from 'react';
import Cell from './Cell';
var defaultDayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
var defaultWeeks = 4;
export function CalendarFrame(props) {
    var days = props.dayLabels || defaultDayLabels;
    var startIndex = typeof props.startIndex === 'string' ?
        days.indexOf(props.startIndex) :
        props.startIndex || 0;
    var maxEvents = props.maxEvents || 5;
    var styles = useMemo(function () {
        var s = {};
        for (var _i = 0, _a = Object.entries(props.classNames || {}); _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], v = _b[1];
            s[k] = k + ' ' + v;
        }
        return s;
    }, [props.classNames]);
    var weeks = useMemo(function () {
        var w = [];
        for (var i = 0; i < (props.weeks || defaultWeeks); i++) {
            var curr = new Date(props.start);
            curr.setDate(curr.getDate() + days.length * i);
            w.push(curr);
        }
        return w;
    }, [props.start, props.weeks]);
    var colorStatuses = props.colorStatuses || {};
    return (React.createElement("table", { className: styles.table },
        React.createElement("thead", null,
            React.createElement("tr", null, __spreadArray([props.title], days).map(function (day, i) {
                return React.createElement("th", { scope: 'column', key: day, className: i ? '' : styles.firstColumn }, day);
            }))),
        React.createElement("tbody", null, weeks.map(function (week, i) {
            var _a;
            var days = [];
            for (var i_1 = 0; i_1 < 7; i_1++) {
                var date = new Date(new Date(week).setDate(week.getDate() + i_1 - startIndex));
                var timestamp = getEventDate(date);
                var today = getEventDate(Date.now()) === timestamp;
                var day = (React.createElement("td", { id: timestamp.toString(), key: timestamp.toString(), className: cx(styles.cell, (_a = {},
                        _a[styles.today || ''] = props.noHighlightToday !== false && today,
                        _a)) },
                    React.createElement("div", null, props.events[timestamp] && !Object.values(props.events[timestamp]).every(function (e) { return !colorStatuses[e.color]; }) ?
                        React.createElement(Cell, __assign({ key: [timestamp, i_1].join('.'), colorNames: props.colorNames, events: props.events[timestamp] }, { maxEvents: maxEvents, styles: styles, timestamp: timestamp, colorStatuses: colorStatuses })) :
                        React.createElement("div", { className: styles.dateNumber }, date.getDate()))));
                days.push(day);
            }
            return React.createElement("tr", { key: 'week.' + i },
                React.createElement("th", { scope: 'row', className: styles.firstColumn }, week.toDateString().slice(4, 10)),
                days);
        }))));
}
//# sourceMappingURL=Frame.js.map