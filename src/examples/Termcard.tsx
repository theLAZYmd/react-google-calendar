import React, { ReactElement } from 'react';
import {CalendarSettings} from '../interfaces';

import Calendar from '../index';
const settings = require('./config.json') as CalendarSettings;

const styles = require('./calendar.module.css');

export default class Termcard extends React.Component {

	render(): ReactElement {
		let sessionID = Math.random().toString(16).slice(2);
		return (
			<div>
				<div>
					<Calendar sessionID={sessionID} settings={settings} styles={styles}/>
				</div>
			</div>
		);
	}

}