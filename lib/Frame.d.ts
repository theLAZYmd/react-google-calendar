import { CalendarEvent } from './Event';
export interface CalendarFrameProps {
    events: {
        [timestamp: number]: CalendarEvent[];
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
    startIndex?: number | string;
}
export declare function CalendarFrame(props: CalendarFrameProps): JSX.Element;
//# sourceMappingURL=Frame.d.ts.map