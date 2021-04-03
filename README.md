# reactjs-google-calendar
========================================

<div align='center'>
  <a href="https://github.com/theLAZYmd/react-google-calendar/blob/master/package.json">
    <img
      src="https://img.shields.io/github/package-json/v/theLAZYmd/react-google-calendar?label=npm"
      alt="desktop version number"
    />
  </a>
  <a href="https://github.com/theLAZYmd/react-google-calendar/blob/master/LICENCE">
			<img
				src="https://img.shields.io/github/license/theLAZYmd/react-google-calendar"
				alt="LICENSE"
			/>
		</a>
</div>

React Google Calendar is a functional and easy way 

- Easy to use
- Modularised (doesn't re-render components unnecessarily)
- API light (makes use of the Google Calendar APIs)
- Customisable: provides a whole range of options to affect how Calendar data is parsed
- Light on dependencies: relies on axios, he, and react
- Native strong typing - no need to install @types/ definition
- Includes TypeScript support
- Supports 'Offline' calendars (events not created from the Google Calendar API)
- Default is client side, supports SSR

Install
-------

reactjs-google-calendar is available on [npm](https://www.npmjs.com/package/react-google-calendar). It
can be installed with the following command:

    npm install react-google-calendar

If you don't want to use npm, [clone this respository](https://github.com/theLAZYmd/reactjs-google-calendar.git) to your project source.


Live Demos
----------------

- [Online calendar (uses Google APIs, full settings)](http://users.ox.ac.uk/~chess/termcard/ht20)
- [Offline Calendar, SSR](https://results.scorchapp.co.uk/calendar)

To learn how to use React Google Calendar:

- [Examples](https://github.com/theLAZYmd/react-google-calendar/blob/master/examples)


React Google Calendar in your client-side (react-scripts) projects
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
<Calendar {...calendarProps} />
```

This library is easier to use with typescript, since type definitions are included for the configuration.
For JavaScript users, see below: CalendarProps should be of the following format.

## Online CalendarProps

```ts
interface CalendarProps {

  //--- Online props

  /**
   * @required
   * A map of Google Calendar IDs to the color you'd like that calendar to be displayed.
   * 
   * A google calendar ID (in v3) is of the format: {hash of 26-letters}@group.calendar.google.com
   * Alternatively, personal user calendars will appear as your email, ex: oxfordunichess@gmail.com
   * Generate a calendar ID by going to:
   * - Settings and Sharing > Integrate Calendar > CalendarID
   * - Make your calendar publically visible in Access Permissions
   * 
   * Colors are applied directly as a CSS property so use MDN specification
   * - https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   * @example
   * ```
   * {
   *  [f8r5s6amq4momsc2s7nrt8vees@group.calendar.google.com]: red
   * }
   * ```
   */
  calendars: {
    [calendarId: string]: string
  },

  settings: {
    
    /**
     * Register for an API key at https://developers.google.com/calendar
     * NOTE: This will be insecure client-side
     */
    APIkey: string

    /**
     * Google Calendars have a 'location' field.
     * If you want your cell to contain a link to a map,
     * include a baseURL for the mapsLink, ex:
     * "mapsLink": "https://www.google.com/maps/search/"
     */
    mapsLink?: string

    /**
     * Special use case property
     * Sometimes, the Google Maps 'location' field requires
     * you to put in address incorrectly
     * ex: will say address rather than landmark
     * or: will get placename wrong
     * You can use a string dictionary to replace those strings
     * wherever they're found in the GoogleEvent locations with your preferences
     * ex: "locationReplacers": {
     *   Christ Church Cathedral": "Christ Church"
     * }
     */
    locationReplacers: {
      [key: string]: string
    },

    /**
     * If the google API link is updated and for some reason this package is not updated,
     * replace the default temporarily here
     * @default 'https://clients6.google.com/calendar/v3/calendars/'
     */    
    baseURL?: string

  },

  //--- Universal props

  // Fetch events from Google calendars starting from what date
  start: Date

  /**
   * Fetch events from Google calendars ending at what date
   * @default Date.now()
   */
  finish?: Date

  // The title of your calendar. Goes in the top left cell of the table generated.
  title?: string

  /**
   * What timezone should this calendar be displayed in?
   * You can set this client-side to make it adapt to users' browsers
   */
  timeZone?: string

  /**
   * An object assigning classnames to each element of the table.
   * You can also just plug in a .module.css file, ex:
   * 
   * import styles from myCalendar.module.css
   * <Calendar {...calendarProps} classNames={styles} />
   * 
   * See below for the list of available classNames
   */
  classNames?: {[key: string]: string}

  /**
   * How many weeks should be displayed?
   * @default 4
   */
  weeks?: number

  /**
   * A custom list of days to display in the header of the table
   * First day of the week should be a monday
   * Submit a pull request for support with weeks starting on Sundays or other
   * @default ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
   */
  dayLabels?: string[]

  /**
   * If you want to use a custom link component,
   * ex: next/link to route components
   * then add it hears as prop. ex:
   * 
   * import Link from 'next/link';
   * <Calendar {...calendarProps} classNames={Link} />
   */
  customLinkComponent?: () => ReactElement

  /**
   * How many events should be rendered per cell?
   * Any more and a 'more' sign will be displayed
   * which can be clicked to be expanded
   * @default 5
   */
  maxEvents?: number

  /**
   * By default, reactjs-google-calendar will update
   * the hash router of your webpage to today's timestamp
   * to allow users to 'jump-to' the right cell.
   * Set this property to false to disable this feature.
   * @default true
   */
  noUpdateHash?: boolean

  /**
   * By default, reactjs-google-calendar highlights today's cell.
   * Set this property to false to disable this feature.
   * @default true
   */
  noHighlightToday?: boolean
}
```

## Offline CalendarProps

You can use this package client-side and fetch the data server-side too if you so desire.
Alternatively, you can use this package to just generate a calendar, without interacting with the google API.

To do this, simply modify the structure of the props.
The whole section above marked 'OnlineProps' should be replaced with the following:

```ts
interface OfflineProps {

  /**
   * @required
   * Structure your events as an array of CalendarEvents
   * for each possible datestamp
   * You can get CalendarEvent[] as a class from the package.
   * Use the CalendarEvent.fromGeneric() static function
   * to construct new events, not new CalendarEvent() as this constructor
   * is used for forming new Events from GoogleEvent objects.
   * 
   * We recommend you use the getEventDate() function from the package
   * to construct your timestamps, as this gives a unique timestamp
   * for each day.
  events: {
    [timestamp: string]: CalendarEvent[]
  }

  /**
   * @required
   * A dictionary of colors to the name of the category of event.
   * Which ordinarily would be populated by the calendarName field
   * from a Google Event.
   * NOTE: we do not create this dictionary by calendarId anymore
   * since we are not fetching any Google calendars.
   */
  calendars: {
    [color: string]: string //calendarName
  }

  /**
   * Note that the settings dictionary is not a thing anymore
   * for these OfflineProps, and the interface for the
   * calendars prop has changed.
   * See examples for help/
   */
}

type CalendarProps = (OfflineProps | OnlineProps) & GenericProps
```

## List of classNames

```css
table
today
firstColumn
cell
dateNumber
key
status
```
Make a pull request if you need more.


Contributing
--------------------

To discuss a new feature or ask a question, open an [issue](https://github.com/theLAZYmd/react-google-calendar/issues). To fix a bug, submit a pull request to be credited with the [contributors](https://github.com/theLAZYmd/react-google-calendar/graphs/contributors)! Remember, a pull request, *with test*, is best.