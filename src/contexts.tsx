import React, { Context, createContext } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { CalendarSettings } from './interfaces';

type ContextValue<T> = [Context<T>, T];

export default function Contexts({ values, children }: {
  values: ContextValue<any>[]
  children?: ReactNode
}) {

  return values.reduce((acc, [context, value]) => {
    return (
      <context.Provider value={value}>
        {acc}
      </context.Provider>
    );
  }, children) as any as ReactElement;
  
}

export const LinkComponentContext = createContext(null as ((...args: any[]) => JSX.Element) | null);
export const CalendarSettingsContext = createContext({} as CalendarSettings);