# react-google-calendar
========================================

React Google Calendar is a functional and easy way 

- Easy to use
- Modularised (doesn't re-render components unnecessarily)
- API light (makes use of the Google Calendar APIs)
- Customisable: provides a whole range of options to affect how Calendar data is parsed
- Light on dependencies: relies on axios, he, and react
- Native strong typing - no need to install @types/ definition
- Includes TypeScript support

Install
-------

react-google-calendar is available on [npm](https://www.npmjs.com/package/react-google-calendar). It
can be installed with the following command:

    npm install react-google-calendar

If you don't want to use npm, [clone this respository](https://github.com/theLAZYmd/react-google-calendar.git) to your project source.


Homepage & Demo
----------------

- [Demo](https://oxfordunichess.github.io/oucc-frontend/termcard)

To learn how to use React Google Calendar:

- [Examples](https://github.com/theLAZYmd/react-google-calendar/blob/master/examples)


React Google Calendar in your React projects
--------------------

Simply import the package into your component with

```jsx
import Calendar from 'react-google-calendar';
```

And use as a React component, specifying three settings of:
- SessionID: [optional] a query parameter with which to make requests through axios. Not required, used to request new data from CDNs in the project in which this was first designed (leave as '' for none).
- Settings: See below for settings format
- Styles: a module.css component

```html
<Calendar sessionID={sessionID} settings={settings} styles={styles}/>
```

Register for an API key at https://developers.google.com/calendar

The settings config should be of the following format:

```js
{

// Register for an API key
  "APIkey": "",

/**
 * Calendar IDs should be an object of key-value pairs.
 * Each key should be a calendar link of the format
 * {random string of 26-letters}@group.calendar.google.com
 * Example: f8r5s6amq4momsc2s7nrt8vees@group.calendar.google.com
 * Alternatively personal user calendars will appear as
 * oxfordunichess@gmail.com
 * Get this calendar ID by going to
 * Settings and Sharing > Integrate Calendar > CalendarID
 * Make your calendar publically visible in Access Permissions
 * The value fields of this object should be html colours
 */
  "calendarIDs": {
    [calendarID: string]: [colour: string]

// If you want your locations to be rendered as a link to a map. Leave blank for none. Use Google Maps (below) as default
  },
  "mapsLink": "https://www.google.com/maps/search/",

/**
 * The renderer takes the first line of a location
 * in the Google Calendar entry and renders it
 * Use this to 'adjust' any locations
 */
  "locationReplacers": {
    "Christ Church Cathedral": "Christ Church"
  },

// When should the calendar start date be? (a Sunday)
  "start": "6 October 2019",

// When should the calendar finish date be?
  "finish": "8 December 2019",

// What should the calendar title be?
  "title": "MT'19",

// How should the days of the week be displayed on the top row?
// (Must start with a Sunday)
  "days": [
    "SUN",
    "MON",
    "TUES",
    "WED",
    "THURS",
    "FRI",
    "SAT"
  ]
}
```

Contributing
------------

To discuss a new feature or ask a question, open an issue. To fix a bug, submit a pull request to be credited with the [contributors](https://github.com/theLAZYmd/react-google-calendar/graphs/contributors)! Remember, a pull request, *with test*, is best.