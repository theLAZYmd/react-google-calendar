import he from 'he';
const regexes = {
    space: /\s+/g,
    facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:events\/)?(?:[0-9]*\/)/
};
export class CalendarEvent {
    constructor(event, calendarName, color, { locationReplacers, mapsLink }) {
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
    static fromGeneric(e, calendarName, color, { locationReplacers, mapsLink }) {
        var _a, _b, _c;
        return new CalendarEvent({
            created: ((_a = e.created) === null || _a === void 0 ? void 0 : _a.toString()) || new Date().toString(),
            htmlLink: e.link || '',
            summary: e.title || '',
            status: e.status || '',
            start: {
                dateTime: ((_b = e.start) === null || _b === void 0 ? void 0 : _b.toString()) || ''
            },
            end: {
                dateTime: ((_c = e.end) === null || _c === void 0 ? void 0 : _c.toString()) || new Date().toString()
            },
            location: e.location || ''
        }, calendarName, color, { locationReplacers, mapsLink });
    }
    get location() {
        let l = this.rawLocation.split(',').shift();
        if (this.locationReplacers[l])
            return this.locationReplacers[l];
        else
            return l;
    }
    get facebookEvent() {
        let facebookEvent = '';
        if (regexes.facebook.test(this.rawDescription)) {
            facebookEvent = this.rawDescription.match(regexes.facebook)[0];
        }
        return facebookEvent;
    }
    get description() {
        let description = this.rawDescription;
        let start = description.indexOf('<a');
        while (start !== -1) {
            let end = description.indexOf('/a>') + 3;
            description = description.slice(0, start) + description.slice(end);
            start = description.indexOf('<a');
        }
        description = description.replace(this.facebookEvent, '').trim();
        return description;
    }
}
//# sourceMappingURL=Event.js.map