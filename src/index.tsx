import React, { ReactElement } from 'react';
import Event from './event';
import axios from 'axios';

import { CalendarProps, GoogleCalendar, GoogleEvent, StringDictionary, BooleanDictionary, EventDictionary, CalendarSettings, StyleDictionary } from './interfaces';

export default class Calendar extends React.Component<{
	sessionID: string,
	settings: CalendarSettings,
	styles: StyleDictionary
}, {
	calendarIDs: StringDictionary,
	APIkey: string,
	today: number,
	start: Date,
	finish: Date,
	events: EventDictionary,
	colours: StringDictionary,
	colourStatuses: BooleanDictionary,
	locationReplacers: StringDictionary,
	mapsLink: string,
	days: string[]
}> {

	constructor(props: CalendarProps) {
		super(props);
		this.state = {
			calendarIDs: {},
			APIkey: '',
			today: Calendar.getEventDate(Date.now()),
			start: new Date(this.props.settings.start || '6 October 2019'),
			finish: new Date(this.props.settings.finish || '8 December 2019'),
			events: {},
			colours: {},
			colourStatuses: {},
			locationReplacers: {},
			mapsLink: '',
			days: []
		};
		window.location = Calendar.setSection(window.location, this.state.today) as unknown as Location;
		this.updateColourStatuses = this.updateColourStatuses.bind(this);
	}

	updateStateFromProps(props: CalendarProps) {
		this.setState({
			calendarIDs: props.settings.calendarIDs,
			APIkey: props.settings.APIkey,
			today: Calendar.getEventDate(Date.now()),
			start: new Date(props.settings.start || '6 October 2019'),
			finish: new Date(props.settings.finish || '8 December 2019'),
			events: {},
			colours: {},
			colourStatuses: {},
			locationReplacers: props.settings.locationReplacers,
			mapsLink: props.settings.mapsLink,
			days: props.settings.days
		});	
	}

	componentDidUpdate() {
		let prevCalendarIDs = Object.assign({}, this.state.calendarIDs) as StringDictionary;
		if (Object.keys(prevCalendarIDs).length !== Object.keys(this.props.settings.calendarIDs).length) this.updateStateFromProps(this.props);
		let obj = {} as StringDictionary;
		for (let [k, v] of Object.entries(this.props.settings.calendarIDs)) {
			if (prevCalendarIDs[k]) continue;
			obj[k] = v;
		}
		this.renderEvents(obj);
	}

	static setSection(location: Location, id: number): string {
		return location.href.slice(0, -location.hash.length) + '#' + id.toString();
	}

	static getEventDate(date: number | Date | string): number {
		let obj = new Date(date);
		obj.setHours(0);
		obj.setMinutes(0);
		obj.setSeconds(0);
		obj.setMilliseconds(0);
		return obj.valueOf() / 1000;
	}

	static isDateEqual(date1: Date, date2: Date): boolean {
		if (date1.getFullYear() !== date2.getFullYear()) return false;
		if (date1.getMonth() === date2.getMonth()) return false;
		if (date1.getDate() === date2.getDate()) return false;
		return true;
	}

	static getDisplayTime(date: Date): string {
		return date.getHours() + ':' + '0'.repeat(2 - date.getMinutes().toString().length) + date.getMinutes();
	}

	renderFrame(): ReactElement {
		let weeks = [];
		for (let i = 0; i < 9; i++) {
			let curr = new Date(this.state.start);
			curr.setDate(curr.getDate() + 7 * i);
			weeks.push(curr);
		}
		return (
			<table className={this.props.styles.table}>
				<thead>
					<tr>
						{[this.props.settings.title, ...this.props.settings.days].map((day, i) => {
							return <th scope='column' key={day} className={i ? '' : this.props.styles.firstColumn}>{day}</th>;
						})}
					</tr>
				</thead>
				<tbody>						
					{weeks.map((week, i) => {
						let days = [];
						for (let i = 0; i < 7; i++) {
							let date = new Date(new Date(week).setDate(week.getDate() + i));
							let timestamp = Calendar.getEventDate(date);
							let today = false;
							if (this.state.today === timestamp) today = true;
							let day = (
								<td id={timestamp.toString()} key={timestamp.toString()} className={today ? this.props.styles.today : this.props.styles.cell}>
									<div>
										{this.state.events[timestamp] && !Object.values(this.state.events[timestamp]).every(e => !this.state.colourStatuses[e.color]) ? this.state.events[timestamp]
											.sort((a, b) => {
												if (a.start.getHours() !== b.start.getHours()) return a.start.getHours() - b.start.getHours();
												else return a.start.getMinutes() - b.start.getMinutes();
											})
											.map((event, i) => {
												return (
													<div className={this.props.styles.event} key={[timestamp, i].join('.')} style={this.state.colourStatuses[event.color] ? {} : {
														display: 'none'
													}}>
														<div className={this.props.styles.eventHeader}>
															{<h4 className={this.props.styles.eventName}>
																{<span className={this.props.styles.status} style={{
																	color: event.color
																}}>⬤</span>}
																{<span className='toolTip'>{/* TODO */}</span>}
																{event.facebookEvent ? <a className={this.props.styles.eventTitle} href={event.facebookEvent}>
																	{event.title}
																</a> : event.title}
															</h4>}
														</div>
														{<div>
															<h5>
																{Calendar.getDisplayTime(event.start)}
																{' '}
																{event.map ?
																	<a href={event.map} rel='noopener noreferrer' target='_blank'>
																		{event.location}
																	</a>
																: event.location}
																{'\n'}
																{event.description || null}
															</h5>
														</div>}
													</div>
												);
											})
											: <div className={this.props.styles.dateNumber}>{date.getDate()}</div>}
									</div>
								</td>
							);
							days.push(day);
						}
						return <tr key={'week.' + i}>
							<th scope='row' className={this.props.styles.firstColumn}>
								{'Week ' + i + '\n' + week.toDateString().slice(4, 10)}
							</th>
							{days}						
						</tr>;
					})}
				</tbody>
			</table>
		);
	}

	renderEvents(calendarIDs: StringDictionary) {
		let colours: StringDictionary = {};
		Object.keys(calendarIDs).forEach((calendarId) => {
			axios({
				baseURL: 'https://clients6.google.com/calendar/v3/calendars/',
				url: calendarId + '/events',
				params: {
					calendarId,
					singleEvents: true,
					timeZone: 'Europe/London',
					maxAttendees: 1,
					maxResults: 250,
					sanitizeHtml: true,
					timeMin: new Date(this.state.start).toISOString(), //'2019-10-27T00:00:00Z',
					timeMax: new Date(this.state.finish).toISOString(), //'2019-12-01T00:00:00Z',
					key: this.state.APIkey
				}
			})
				.then((res): any => {
					let data = res.data as GoogleCalendar;
					return data;
				})
				.then((data: GoogleCalendar): [string, GoogleEvent[]] => {
					return [data.summary, data.items];
				})
				.then(([calendarName, events]: [string, GoogleEvent[]]): [StringDictionary, Event[]] => {
					let res = events.map((event) => {			
						let color = calendarIDs[calendarId];
						if (!colours[color]) colours[color] = calendarName;
						return new Event(event, calendarName, color, this.state);
					});
					return [colours, res];
				})
				.then(([colours, events]: [StringDictionary, Event[]]): [StringDictionary, EventDictionary] => {
					let dates = this.state.events;
					events.forEach((event) => {
						let date = Calendar.getEventDate(event.start);
						if (!dates[date]) dates[date] = [];
						dates[date].push(event);
					});
					return [colours, dates];
				})
				.then(([colours, events]: [StringDictionary, EventDictionary]) => {
					let colourStatuses = Object.keys(colours).reduce((acc: BooleanDictionary, curr: string) => {
						acc[curr] = true;
						return acc;
					}, {} as BooleanDictionary);
					this.setState({colours, colourStatuses, events});
				})
				.catch(console.error);
		});
	}

	updateColourStatuses(color: string): void {
		let colourStatuses = Object.assign({}, this.state.colourStatuses);
		colourStatuses[color] = !colourStatuses[color];
		this.setState({
			colourStatuses
		});
	}

	renderKey(): ReactElement {
		let sorted = Object.entries(this.state.colours).sort((a, b) => {
			if (a[1] < b[1]) return -1;
			else if (a[1] > b[1]) return 1;
			else return 0;
		});
		return <div className={this.props.styles.key}>
			{sorted.map(([color, calendarName], i) => {
				return <div className={this.props.styles.key} key={['keyElement', i].join('.')}>
					{<span className={this.props.styles.status} onClick={() => this.updateColourStatuses(color)} style={{
						color
					}}>{this.state.colourStatuses[color] ? '\u2b24' : '\u2b58'}</span>}
					<h4>{'\u200b ' + calendarName}</h4>
				</div>;
			})}
		</div>;
	}

	render(): ReactElement {
		return (
			<>
				{this.renderKey()}
				{this.renderFrame()}
			</>
		);
	}

}