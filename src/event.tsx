import he from 'he';
import { GoogleEvent, GoogleLocation, StringDictionary } from './interfaces';

const regexes = {
	space: /\s+/g,
	facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:events\/)?(?:[0-9]*\/)/
};


export default class Event {

	link: string;
	title: string;
	status: string;
	start: Date;
	created: Date;
	end: Date;
	calendarName: string;
	color: string;
	rawLocation: GoogleLocation | string;
	locationReplacers: StringDictionary;
	rawDescription: string;
	map: string;

	private _location?: string;
	private _facebookEvent?: string;
	private _description?: string;

	constructor(event: GoogleEvent, calendarName: string, color: string, {
		locationReplacers,
		mapsLink
	}: {
		locationReplacers: StringDictionary,
		mapsLink: string
	}) {
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
		this.rawDescription = he.decode(event.description || '');
		this.map = mapsLink ? mapsLink + this.rawLocation.replace(regexes.space, '+') : '';
	}

	get location(): string {		
		if (this._location) return this._location;
		let location;
		let l = this.rawLocation.split(',').shift() as string;
		if (this.locationReplacers[l]) location = this.locationReplacers[l];
		else location = l;
		return this._location = location;
	}


	get facebookEvent(): string {
		if (this._facebookEvent) return this._facebookEvent;
		let facebookEvent = '';
		if (regexes.facebook.test(this.rawDescription)) facebookEvent = (this.rawDescription.match(regexes.facebook) as [string])[0];
		return this._facebookEvent = facebookEvent;
	}

	get description(): string {
		if (this._description) return this._description;
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