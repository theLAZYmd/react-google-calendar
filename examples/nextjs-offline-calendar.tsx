import { useMemo } from 'react';
import GoogleCalendar, { CalendarEvent, getEventDate } from 'reactjs-google-calendar';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import styles from 'myStyles.module.css';

export default function CalendarPage({ events }: { events: CalendarEvent[] }) {

	const formed = useMemo(() => events.map(e => CalendarEvent.fromGeneric(e, e.calendarName, e.color, {})), [events]);
	const start = useMemo(() => {
		let today = new Date();
		return new Date(today.setDate(today.getDate() - today.getDay()));
	}, []);

	const [calendars, timestamped] = useMemo(() => {
		let colors = {} as {[key: string]: string};
		let dict = {} as {[timestamp: number]: CalendarEvent[]};
		formed.forEach((e) => {
			let start = getEventDate(e.start);
			if (!dict[start]) dict[start] = [];
			dict[start].push(e);
			if (!colors[e.color]) colors[e.color] = e.calendarName;
		});
		return [colors, dict];
	}, [formed]);

	return <GoogleCalendar
		calendars={calendars}
		start={start}
		events={timestamped}
		weeks={4}
		classNames={{ ...styles }}
		customLinkComponent={Link}
		noUpdateHash
	/>;

}

export const getStaticProps: GetStaticProps = async () => {

	const res = await fetch('https://{mybackEnd}.com/events' );
	const events = res.json();
	return {
		props: { events },
		revalidate: 10
	};
};