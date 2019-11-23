import Event from './event';

export interface StyleDictionary {
	[key: string]: string
}

export interface EventDictionary {
	[key: string]: Event[]
}

export interface CalendarSettings {
	calendarIDs: StringDictionary,
	APIkey: string,
	mapsLink: string,
	locationReplacers: StringDictionary,
	start: string,
	finish: string,
	title: string,
	days: string[]
}

export interface CalendarProps {
	sessionID: string,
	settings: CalendarSettings
	styles: StyleDictionary
}

export interface GoogleLocation extends String {};

export interface GoogleDate {
	dateTime: string
}

export interface GoogleEvent {
	created: string,
	htmlLink: string,
	summary: string,
	start: GoogleDate,
	end: GoogleDate,
	status: string,
	location: GoogleLocation,
	description: string
}

export interface StringDictionary {
	[key: string]: string
}

export interface BooleanDictionary {
	[key: string]: boolean
}

export interface GoogleCalendar {
	kind: string,
	etag: string,
	summary: string,
	update: string,
	timeZone: string,
	accessRole: string,
	defaultReminders: any[],
	nextSyncToken: string,
	items: GoogleEvent[]
}