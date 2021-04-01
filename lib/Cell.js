import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { LinkComponentContext } from './contexts';
import { getDisplayTime } from './utils';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
export default function Cell(_a) {
    var maxEvents = _a.maxEvents, styles = _a.styles, events = _a.events, colorStatuses = _a.colorStatuses, colorNames = _a.colorNames;
    var Link = useContext(LinkComponentContext);
    var _b = useState(false), isExpanded = _b[0], expand = _b[1];
    return React.createElement(React.Fragment, null, events.sort(function (a, b) {
        if (a.start.getHours() !== b.start.getHours())
            return a.start.getHours() - b.start.getHours();
        else
            return a.start.getMinutes() - b.start.getMinutes();
    })
        .map(function (event, i, arr) {
        var _a;
        if (i === maxEvents && !isExpanded) {
            return React.createElement("div", { key: 'overflowMessage', className: styles.overflowMessage, onClick: function () { return expand(true); } },
                React.createElement("h4", null,
                    React.createElement(FaPlusCircle, null),
                    arr.length - maxEvents,
                    " more"));
        }
        if (i > maxEvents && !isExpanded)
            return null;
        return React.createElement(React.Fragment, { key: 'cell.' + i },
            React.createElement("div", { className: cx(styles.event, (_a = {},
                    _a[styles.hidden] = !colorStatuses[event.color],
                    _a)) },
                React.createElement("div", { className: styles.eventHeader },
                    React.createElement("h4", { className: styles.eventName },
                        React.createElement("span", { className: styles.status, title: colorNames[event.color], style: {
                                color: event.color
                            } }, "\u2B24"),
                        React.createElement("span", { className: 'toolTip' }),
                        event.facebookEvent || event.link ?
                            Link ?
                                React.createElement(Link, { className: styles.eventTitle, href: event.facebookEvent || event.link }, event.title) :
                                React.createElement("a", { className: styles.eventTitle, href: event.facebookEvent || event.link }, event.title) :
                            event.title)),
                React.createElement("div", null,
                    React.createElement("h5", null,
                        getDisplayTime(event.start),
                        ' ',
                        event.map ?
                            Link ?
                                React.createElement(Link, { href: event.map }, event.location) :
                                React.createElement("a", { href: event.map, rel: 'noopener noreferrer', target: '_blank' }, event.location)
                            : event.location,
                        React.createElement("br", null),
                        event.description || null))),
            (i === arr.length - 1) && isExpanded ?
                React.createElement("div", { className: styles.overflowMessage, onClick: function () { return expand(false); } },
                    React.createElement("h4", null,
                        React.createElement(FaMinusCircle, null),
                        "Show less")) :
                null);
    }));
}
//# sourceMappingURL=Cell.js.map