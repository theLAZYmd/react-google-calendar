import React, { createContext } from 'react';
export default function Contexts({ values, children }) {
    return values.reduce((acc, [context, value]) => {
        return (React.createElement(context.Provider, { value: value }, acc));
    }, children);
}
export const LinkComponentContext = createContext(null);
export const CalendarSettingsContext = createContext({});
//# sourceMappingURL=contexts.js.map