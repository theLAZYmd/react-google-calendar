import { CalendarEvent } from '../Event';
interface EventHookProps {
    calendars: {
        [key: string]: string;
    };
    setColorStatuses: (colors: string[]) => void;
    start: Date;
    finish?: Date;
    timeZone?: string;
}
export default function useEvents(props: EventHookProps): {
    colors: {
        [color: string]: string;
    };
    events: {
        [timestamp: number]: CalendarEvent[];
    };
};
export {};
//# sourceMappingURL=useEvents.d.ts.map