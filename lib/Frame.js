import React from 'react';
import cx from 'classnames';
import { getDisplayTime, getEventDate } from './utils';
import { useMemo } from 'react';
const defaultStyles = require('./css/frame.module.css');
const defaultDayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const defaultWeeks = 4;
export function CalendarFrame(props) {
    const days = props.dayLabels || defaultDayLabels;
    const startIndex = typeof props.startIndex === 'string' ?
        days.indexOf(props.startIndex) :
        props.startIndex || 0;
    const styles = useMemo(() => {
        let s = Object.assign({}, defaultStyles);
        for (let [k, v] of Object.entries(props.classNames || {})) {
            s[k] += ' ' + v;
        }
        return s;
    }, []);
    const weeks = useMemo(() => {
        let w = [];
        for (let i = 0; i < (props.weeks || defaultWeeks); i++) {
            let curr = new Date(props.start);
            curr.setDate(curr.getDate() + days.length * i);
            weeks.push(curr);
        }
        return w;
    }, [props.start, props.weeks]);
    const colorStatuses = props.colorStatuses || {};
    return (React.createElement("table", { className: styles.table },
        React.createElement("thead", null,
            React.createElement("tr", null, [props.title, ...days].map((day, i) => {
                return React.createElement("th", { scope: 'column', key: day, className: i ? '' : styles.firstColumn }, day);
            }))),
        React.createElement("tbody", null, weeks.map((week, i) => {
            let days = [];
            for (let i = 0; i < 7; i++) {
                let date = new Date(new Date(week).setDate(week.getDate() + i - startIndex));
                let timestamp = getEventDate(date);
                let today = getEventDate(Date.now()) === timestamp;
                let day = (React.createElement("td", { id: timestamp.toString(), key: timestamp.toString(), className: cx(styles.cell, {
                        [styles.today || '']: props.noHighlightToday !== false && today
                    }) },
                    React.createElement("div", null, props.events[timestamp] && !Object.values(props.events[timestamp]).every(e => !colorStatuses[e.color]) ?
                        props.events[timestamp]
                            .sort((a, b) => {
                            if (a.start.getHours() !== b.start.getHours())
                                return a.start.getHours() - b.start.getHours();
                            else
                                return a.start.getMinutes() - b.start.getMinutes();
                        })
                            .map((event, i) => {
                            return (React.createElement("div", { className: styles.event, key: [timestamp, i].join('.'), style: colorStatuses[event.color] ? {} : {
                                    display: 'none'
                                } },
                                React.createElement("div", { className: styles.eventHeader },
                                    React.createElement("h4", { className: styles.eventName },
                                        React.createElement("span", { className: styles.status, style: {
                                                color: event.color
                                            } }, "\u2B24"),
                                        React.createElement("span", { className: 'toolTip' }),
                                        event.facebookEvent ?
                                            React.createElement("a", { className: styles.eventTitle, href: event.facebookEvent }, event.title) :
                                            event.title)),
                                React.createElement("div", null,
                                    React.createElement("h5", null,
                                        getDisplayTime(event.start),
                                        ' ',
                                        event.map ?
                                            React.createElement("a", { href: event.map, rel: 'noopener noreferrer', target: '_blank' }, event.location)
                                            : event.location,
                                        '\n',
                                        event.description || null))));
                        }) :
                        React.createElement("div", { className: styles.dateNumber }, date.getDate()))));
                days.push(day);
            }
            return React.createElement("tr", { key: 'week.' + i },
                React.createElement("th", { scope: 'row', className: styles.firstColumn }, 'Week ' + i + '\n' + week.toDateString().slice(4, 10)),
                days);
        }))));
}
//# sourceMappingURL=Frame.js.map