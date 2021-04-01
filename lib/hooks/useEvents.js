var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from 'axios';
import { CalendarSettingsContext } from '../contexts';
import { CalendarEvent } from '../Event';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getEventDate } from '../utils';
var baseURL = 'https://clients6.google.com/calendar/v3/calendars/';
var defaultTimeZone = 'Europe/London';
export default function useEvents(props) {
    var _this = this;
    var _a = useState(props.events || {}), events = _a[0], setEvents = _a[1];
    var _b = useState({}), colors = _b[0], setColors = _b[1]; /* calendarName */
    var settings = useContext(CalendarSettingsContext);
    var handleId = useCallback(function (calendarId) { return __awaiter(_this, void 0, void 0, function () {
        var eventDict, res, data, calendarName, eventArr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventDict = events;
                    return [4 /*yield*/, axios({
                            baseURL: settings.baseURL || baseURL,
                            url: calendarId + '/events',
                            params: {
                                calendarId: calendarId,
                                singleEvents: true,
                                timeZone: props.timeZone || defaultTimeZone,
                                maxAttendees: 1,
                                maxResults: 250,
                                sanitizeHtml: true,
                                timeMin: new Date(props.start).toISOString(),
                                timeMax: new Date(props.finish || Date.now()).toISOString(),
                                key: settings.APIkey
                            }
                        })];
                case 1:
                    res = _a.sent();
                    data = res.data;
                    calendarName = data.summary;
                    eventArr = [];
                    data.items.forEach(function (event) {
                        var color = props.calendars[calendarId];
                        eventArr.push(new CalendarEvent(event, calendarName, color, settings));
                    });
                    eventArr.forEach(function (event) {
                        var date = getEventDate(event.start);
                        if (!eventDict[date])
                            eventDict[date] = [];
                        eventDict[date].push(event);
                    });
                    setEvents(eventDict);
                    return [2 /*return*/];
            }
        });
    }); }, [events, colors, settings, setEvents, props]);
    var parseColorsFromEvents = useCallback(function (eventDict) {
        var c = colors;
        for (var _i = 0, _a = Object.values(eventDict); _i < _a.length; _i++) {
            var eventArr = _a[_i];
            for (var _b = 0, eventArr_1 = eventArr; _b < eventArr_1.length; _b++) {
                var e = eventArr_1[_b];
                if (!c[e.color])
                    c[e.color] = e.calendarName;
            }
        }
        console.log(c);
        setColors(c);
        props.setColorStatuses(Object.keys(c));
    }, [setColors, props.setColorStatuses]);
    useEffect(function () {
        Object.entries(props.calendars).forEach(function (_a) {
            var k = _a[0], v = _a[1];
            if (k === v)
                return;
            handleId(k);
        });
    }, [props.calendars]);
    useEffect(function () {
        if (props.events)
            setEvents(props.events);
    }, [setEvents, props.events]);
    useEffect(function () {
        if (!Object.keys(events).length)
            return;
        parseColorsFromEvents(events);
    }, [events, parseColorsFromEvents]);
    return { colors: colors, events: events };
}
//# sourceMappingURL=useEvents.js.map