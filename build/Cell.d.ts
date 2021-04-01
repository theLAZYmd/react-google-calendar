import { CalendarEvent } from './Event';
export default function Cell({ maxEvents, styles, events, colorStatuses, colorNames }: {
    maxEvents: number;
    styles: {
        [key: string]: string;
    };
    events: CalendarEvent[];
    colorStatuses: {
        [key: string]: boolean;
    };
    colorNames: {
        [key: string]: string;
    };
}): JSX.Element;
