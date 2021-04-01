export interface CalendarKeyProps {
    classNames?: {
        [key: string]: string;
    };
    colorNames: {
        [color: string]: string;
    };
    updateColorStatuses: (color: string) => void;
    colorStatuses: {
        [color: string]: boolean;
    };
}
export declare function CalendarKey(props: CalendarKeyProps): JSX.Element;
//# sourceMappingURL=Key.d.ts.map