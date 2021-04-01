import he from 'he';
var regexes = {
    space: /\s+/g,
    facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:events\/)?(?:[0-9]*\/)/
};
var CalendarEvent = /** @class */ (function () {
    function CalendarEvent(event, calendarName, color, _a) {
        var locationReplacers = _a.locationReplacers, mapsLink = _a.mapsLink;
        this.created = new Date(event.created);
        this.link = event.htmlLink;
        this.title = event.summary;
        this.status = event.status;
        this.start = new Date(event.start.dateTime);
        this.end = new Date(event.end.dateTime);
        this.calendarName = calendarName;
        this.color = color;
        this.rawLocation = event.location || '';
        this.locationReplacers = locationReplacers || {};
        this.rawDescription = he.decode(event.description || '');
        this.map = mapsLink ? mapsLink + this.rawLocation.replace(regexes.space, '+') : '';
    }
    CalendarEvent.fromGeneric = function (e, calendarName, color, _a) {
        var _b, _c, _d;
        var locationReplacers = _a.locationReplacers, mapsLink = _a.mapsLink;
        return new CalendarEvent({
            created: ((_b = e.created) === null || _b === void 0 ? void 0 : _b.toString()) || new Date().toString(),
            htmlLink: e.link || '',
            summary: e.title || '',
            status: e.status || '',
            start: {
                dateTime: ((_c = e.start) === null || _c === void 0 ? void 0 : _c.toString()) || ''
            },
            end: {
                dateTime: ((_d = e.end) === null || _d === void 0 ? void 0 : _d.toString()) || new Date().toString()
            },
            location: e.location || ''
        }, calendarName, color, { locationReplacers: locationReplacers, mapsLink: mapsLink });
    };
    Object.defineProperty(CalendarEvent.prototype, "location", {
        get: function () {
            var l = this.rawLocation.split(',').shift();
            if (this.locationReplacers[l])
                return this.locationReplacers[l];
            else
                return l;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CalendarEvent.prototype, "facebookEvent", {
        get: function () {
            var facebookEvent = '';
            if (regexes.facebook.test(this.rawDescription)) {
                facebookEvent = this.rawDescription.match(regexes.facebook)[0];
            }
            return facebookEvent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CalendarEvent.prototype, "description", {
        get: function () {
            var description = this.rawDescription;
            var start = description.indexOf('<a');
            while (start !== -1) {
                var end = description.indexOf('/a>') + 3;
                description = description.slice(0, start) + description.slice(end);
                start = description.indexOf('<a');
            }
            description = description.replace(this.facebookEvent, '').trim();
            return description;
        },
        enumerable: false,
        configurable: true
    });
    return CalendarEvent;
}());
export { CalendarEvent };
//# sourceMappingURL=Event.js.map