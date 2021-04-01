import React from 'react';
import { CalendarSettings } from './interfaces';
import { CalendarFrameProps } from './Frame';
export * from './interfaces';
export * from './Event';
export * from './Key';
export * from './utils';
export interface CalendarProps {
    calendars: {
        [key: string]: string;
    };
    start: Date;
    finish?: Date;
    title?: string;
    timeZone?: string;
    settings: CalendarSettings;
    classNames?: {
        [key: string]: string;
    };
    days?: string[];
    noUpdateHash?: boolean;
    customLinkComponent?: React.Component;
}
export default function Calendar(props: CalendarProps & Omit<CalendarFrameProps, 'events' | 'colorStatuses'>): JSX.Element;
//# sourceMappingURL=index.d.ts.map