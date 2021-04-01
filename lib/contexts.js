import React, { createContext } from 'react';
export default function Contexts(_a) {
    var values = _a.values, children = _a.children;
    return values.reduce(function (acc, _a) {
        var context = _a[0], value = _a[1];
        return (React.createElement(context.Provider, { value: value }, acc));
    }, children);
}
export var LinkComponentContext = createContext(null);
export var CalendarSettingsContext = createContext({});
//# sourceMappingURL=contexts.js.map