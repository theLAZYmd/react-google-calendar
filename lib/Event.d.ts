import { CalendarSettings, GoogleEvent, GoogleLocation } from './interfaces';
export declare class CalendarEvent {
    link: string;
    title: string;
    status: string;
    start: Date;
    created: Date;
    end: Date;
    calendarName: string;
    color: string;
    rawLocation: GoogleLocation | string;
    locationReplacers: {
        [key: string]: string;
    };
    rawDescription: string;
    map: string;
    constructor(event: GoogleEvent, calendarName: string, color: string, { locationReplacers, mapsLink }: Partial<CalendarSettings>);
    static fromGeneric(e: Partial<CalendarEvent>, calendarName: string, color: string, { locationReplacers, mapsLink }: Partial<CalendarSettings>): CalendarEvent;
    get location(): string;
    get facebookEvent(): string;
    get description(): string;
}
//# sourceMappingURL=Event.d.ts.map