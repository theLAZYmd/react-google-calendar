import React, { Context } from 'react';
import { ReactNode } from 'react';
import { CalendarSettings } from './interfaces';
declare type ContextValue<T> = [Context<T>, T];
export default function Contexts({ values, children }: {
    values: ContextValue<any>[];
    children?: ReactNode;
}): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export declare const LinkComponentContext: React.Context<((...args: any[]) => JSX.Element) | null>;
export declare const CalendarSettingsContext: React.Context<CalendarSettings>;
export {};
