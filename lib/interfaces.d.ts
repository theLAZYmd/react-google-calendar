export interface CalendarSettings {
    baseURL?: string;
    APIkey?: string;
    mapsLink?: string;
    locationReplacers: {
        [key: string]: string;
    };
}
export declare type GoogleLocation = string;
export interface GoogleDate {
    dateTime: string;
}
export interface GoogleEvent {
    created: string;
    htmlLink: string;
    summary: string;
    start: GoogleDate;
    end: GoogleDate;
    status: string;
    location: GoogleLocation;
    description?: string;
}
export interface GoogleCalendar {
    kind: string;
    etag: string;
    summary: string;
    update: string;
    timeZone: string;
    accessRole: string;
    defaultReminders: any[];
    nextSyncToken: string;
    items: GoogleEvent[];
}
//# sourceMappingURL=interfaces.d.ts.map