"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const he_1 = __importDefault(require("he"));
const regexes = {
    space: /\s+/g,
    facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:events\/)?(?:[0-9]*\/)/
};
class Event {
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
        this.locationReplacers = locationReplacers;
        this.rawDescription = he_1.default.decode(event.description || '');
        this.map = mapsLink ? mapsLink + this.rawLocation.replace(regexes.space, '+') : '';
    }
    get location() {
        if (this._location)
            return this._location;
        let location;
        let l = this.rawLocation.split(',').shift();
        if (this.locationReplacers[l])
            location = this.locationReplacers[l];
        else
            location = l;
        return this._location = location;
    }
    get facebookEvent() {
        if (this._facebookEvent)
            return this._facebookEvent;
        let facebookEvent = '';
        if (regexes.facebook.test(this.rawDescription))
            facebookEvent = this.rawDescription.match(regexes.facebook)[0];
        return this._facebookEvent = facebookEvent;
    }
    get description() {
        if (this._description)
            return this._description;
        let description = this.rawDescription;
        let start = description.indexOf('<a');
        while (start !== -1) {
            let end = description.indexOf('/a>') + 3;
            description = description.slice(0, start) + description.slice(end);
            start = description.indexOf('<a');
        }
        description = description.replace(this.facebookEvent, '').trim();
        return this._description = description;
    }
}
exports.default = Event;
//# sourceMappingURL=event.js.map