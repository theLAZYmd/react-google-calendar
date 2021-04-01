import he from 'he';
import { CalendarSettings, GoogleEvent, GoogleLocation } from './interfaces';

const regexes = {
  space: /\s+/g,
  facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:events\/)?(?:[0-9]*\/)/
};


export class CalendarEvent {

  link: string;
  title: string;
  status: string;
  start: Date;
  created: Date;
  end: Date;
  calendarName: string;
  color: string;
  rawLocation: GoogleLocation | string;
  locationReplacers: {[key: string]: string}
  rawDescription: string;
  map: string;

  constructor(event: GoogleEvent, calendarName: string, color: string, {
    locationReplacers,
    mapsLink
  }: Partial<CalendarSettings>) {
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

  static fromGeneric(e: Partial<CalendarEvent>, calendarName: string, color: string, {
    locationReplacers,
    mapsLink
  }: Partial<CalendarSettings>) {
    return new CalendarEvent({
      created: e.created?.toString() || new Date().toString(),
      htmlLink: e.link || '',
      summary: e.title || '',
      status: e.status || '',
      start: {
        dateTime: e.start?.toString() || ''
      },
      end: {
        dateTime: e.end?.toString() || new Date().toString()
      },
      location: e.location || ''
    }, calendarName, color, { locationReplacers, mapsLink });
  }

  get location(): string {    
    let l = this.rawLocation.split(',').shift() as string;
    if (this.locationReplacers[l]) return this.locationReplacers[l];
    else return l;
  }

  get facebookEvent(): string {
    let facebookEvent = '';
    if (regexes.facebook.test(this.rawDescription)) {
      facebookEvent = (this.rawDescription.match(regexes.facebook) as [string])[0];
    }
    return facebookEvent;
  }

  get description(): string {
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