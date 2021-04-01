import React from 'react';
import { CalendarSettings } from './interfaces';
import { CalendarFrameProps } from './Frame';
import { CalendarEvent } from './Event';
export * from './interfaces';
export * from './Event';
export * from './Key';
export * from './utils';
export interface OfflineCalendarProps {
    events: {
        [timestamp: number]: CalendarEvent[];
    };
    calendars: {
        [color: string]: string;
    };
    settings: undefined;
}
export interface OnlineCalendarProps {
    settings: CalendarSettings;
    calendars: {
        [key: string]: string;
    };
}
export interface CalendarProps {
    start: Date;
    finish?: Date;
    title?: string;
    timeZone?: string;
    classNames?: {
        [key: string]: string;
    };
    days?: string[];
    noUpdateHash?: boolean;
    customLinkComponent?: React.Component;
}
export default function Calendar(props: CalendarProps & Omit<CalendarFrameProps, 'events' | 'colorStatuses'> & (OfflineCalendarProps | OnlineCalendarProps)): JSX.Element;
//# sourceMappingURL=index.d.ts.map