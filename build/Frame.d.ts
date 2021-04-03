import { CalendarEvent } from './Event';
export interface CalendarFrameProps {
    events: {
        [timestamp: number]: CalendarEvent[];
    };
    colorNames?: {
        [color: string]: string;
    };
    colorStatuses?: {
        [color: string]: boolean;
    };
    start: Date;
    title?: string;
    weeks?: number;
    dayLabels?: string[];
    noHighlightToday?: boolean;
    classNames?: {
        table?: string;
        firstColumn?: string;
        cell?: string;
        event?: string;
    };
    maxEvents?: number;
}
export declare function CalendarFrame(props: CalendarFrameProps): JSX.Element;
