"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const event_1 = __importDefault(require("./event"));
const axios_1 = __importDefault(require("axios"));
class Calendar extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarIDs: {},
            APIkey: '',
            today: Calendar.getEventDate(Date.now()),
            start: new Date(this.props.settings.start || '6 October 2019'),
            finish: new Date(this.props.settings.finish || '8 December 2019'),
            events: {},
            colours: {},
            colourStatuses: {},
            locationReplacers: {},
            mapsLink: '',
            days: []
        };
        window.location = Calendar.setSection(window.location, this.state.today);
        this.updateColourStatuses = this.updateColourStatuses.bind(this);
    }
    updateStateFromProps(props) {
        this.setState({
            calendarIDs: props.settings.calendarIDs,
            APIkey: props.settings.APIkey,
            today: Calendar.getEventDate(Date.now()),
            start: new Date(props.settings.start || '6 October 2019'),
            finish: new Date(props.settings.finish || '8 December 2019'),
            events: {},
            colours: {},
            colourStatuses: {},
            locationReplacers: props.settings.locationReplacers,
            mapsLink: props.settings.mapsLink,
            days: props.settings.days
        });
    }
    componentDidUpdate() {
        let prevCalendarIDs = Object.assign({}, this.state.calendarIDs);
        if (Object.keys(prevCalendarIDs).length !== Object.keys(this.props.settings.calendarIDs).length)
            this.updateStateFromProps(this.props);
        let obj = {};
        for (let [k, v] of Object.entries(this.props.settings.calendarIDs)) {
            if (prevCalendarIDs[k])
                continue;
            obj[k] = v;
        }
        this.renderEvents(obj);
    }
    static setSection(location, id) {
        return location.href.slice(0, -location.hash.length) + '#' + id.toString();
    }
    static getEventDate(date) {
        let obj = new Date(date);
        obj.setHours(0);
        obj.setMinutes(0);
        obj.setSeconds(0);
        obj.setMilliseconds(0);
        return obj.valueOf() / 1000;
    }
    static isDateEqual(date1, date2) {
        if (date1.getFullYear() !== date2.getFullYear())
            return false;
        if (date1.getMonth() === date2.getMonth())
            return false;
        if (date1.getDate() === date2.getDate())
            return false;
        return true;
    }
    static getDisplayTime(date) {
        return date.getHours() + ':' + '0'.repeat(2 - date.getMinutes().toString().length) + date.getMinutes();
    }
    renderFrame() {
        let weeks = [];
        for (let i = 0; i < 9; i++) {
            let curr = new Date(this.state.start);
            curr.setDate(curr.getDate() + 7 * i);
            weeks.push(curr);
        }
        return (react_1.default.createElement("table", { className: this.props.styles.table },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null, [this.props.settings.title, ...this.props.settings.days].map((day, i) => {
                    return react_1.default.createElement("th", { scope: 'column', key: day, className: i ? '' : this.props.styles.firstColumn }, day);
                }))),
            react_1.default.createElement("tbody", null, weeks.map((week, i) => {
                let days = [];
                for (let i = 0; i < 7; i++) {
                    let date = new Date(new Date(week).setDate(week.getDate() + i));
                    let timestamp = Calendar.getEventDate(date);
                    let today = false;
                    if (this.state.today === timestamp)
                        today = true;
                    let day = (react_1.default.createElement("td", { id: timestamp.toString(), key: timestamp.toString(), className: today ? this.props.styles.today : this.props.styles.cell },
                        react_1.default.createElement("div", null, this.state.events[timestamp] && !Object.values(this.state.events[timestamp]).every(e => !this.state.colourStatuses[e.color]) ? this.state.events[timestamp]
                            .sort((a, b) => {
                            if (a.start.getHours() !== b.start.getHours())
                                return a.start.getHours() - b.start.getHours();
                            else
                                return a.start.getMinutes() - b.start.getMinutes();
                        })
                            .map((event, i) => {
                            return (react_1.default.createElement("div", { className: this.props.styles.event, key: [timestamp, i].join('.'), style: this.state.colourStatuses[event.color] ? {} : {
                                    display: 'none'
                                } },
                                react_1.default.createElement("div", { className: this.props.styles.eventHeader }, react_1.default.createElement("h4", { className: this.props.styles.eventName },
                                    react_1.default.createElement("span", { className: this.props.styles.status, style: {
                                            color: event.color
                                        } }, "\u2B24"),
                                    react_1.default.createElement("span", { className: 'toolTip' }),
                                    event.facebookEvent ? react_1.default.createElement("a", { className: this.props.styles.eventTitle, href: event.facebookEvent }, event.title) : event.title)),
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("h5", null,
                                        Calendar.getDisplayTime(event.start),
                                        ' ',
                                        event.map ?
                                            react_1.default.createElement("a", { href: event.map, rel: 'noopener noreferrer', target: '_blank' }, event.location)
                                            : event.location,
                                        '\n',
                                        event.description || null))));
                        })
                            : react_1.default.createElement("div", { className: this.props.styles.dateNumber }, date.getDate()))));
                    days.push(day);
                }
                return react_1.default.createElement("tr", { key: 'week.' + i },
                    react_1.default.createElement("th", { scope: 'row', className: this.props.styles.firstColumn }, 'Week ' + i + '\n' + week.toDateString().slice(4, 10)),
                    days);
            }))));
    }
    renderEvents(calendarIDs) {
        let colours = {};
        Object.keys(calendarIDs).forEach((calendarId) => {
            axios_1.default({
                baseURL: 'https://clients6.google.com/calendar/v3/calendars/',
                url: calendarId + '/events',
                params: {
                    calendarId,
                    singleEvents: true,
                    timeZone: 'Europe/London',
                    maxAttendees: 1,
                    maxResults: 250,
                    sanitizeHtml: true,
                    timeMin: new Date(this.state.start).toISOString(),
                    timeMax: new Date(this.state.finish).toISOString(),
                    key: this.state.APIkey
                }
            })
                .then((res) => {
                let data = res.data;
                return data;
            })
                .then((data) => {
                return [data.summary, data.items];
            })
                .then(([calendarName, events]) => {
                let res = events.map((event) => {
                    let color = calendarIDs[calendarId];
                    if (!colours[color])
                        colours[color] = calendarName;
                    return new event_1.default(event, calendarName, color, this.state);
                });
                return [colours, res];
            })
                .then(([colours, events]) => {
                let dates = this.state.events;
                events.forEach((event) => {
                    let date = Calendar.getEventDate(event.start);
                    if (!dates[date])
                        dates[date] = [];
                    dates[date].push(event);
                });
                return [colours, dates];
            })
                .then(([colours, events]) => {
                let colourStatuses = Object.keys(colours).reduce((acc, curr) => {
                    acc[curr] = true;
                    return acc;
                }, {});
                this.setState({ colours, colourStatuses, events });
            })
                .catch(console.error);
        });
    }
    updateColourStatuses(color) {
        let colourStatuses = Object.assign({}, this.state.colourStatuses);
        colourStatuses[color] = !colourStatuses[color];
        this.setState({
            colourStatuses
        });
    }
    renderKey() {
        let sorted = Object.entries(this.state.colours).sort((a, b) => {
            if (a[1] < b[1])
                return -1;
            else if (a[1] > b[1])
                return 1;
            else
                return 0;
        });
        return react_1.default.createElement("div", { className: this.props.styles.key }, sorted.map(([color, calendarName], i) => {
            return react_1.default.createElement("div", { className: this.props.styles.key, key: ['keyElement', i].join('.') },
                react_1.default.createElement("span", { className: this.props.styles.status, onClick: () => this.updateColourStatuses(color), style: {
                        color
                    } }, this.state.colourStatuses[color] ? '\u2b24' : '\u2b58'),
                react_1.default.createElement("h4", null, '\u200b ' + calendarName));
        }));
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            this.renderKey(),
            this.renderFrame()));
    }
}
exports.default = Calendar;
//# sourceMappingURL=index.js.map