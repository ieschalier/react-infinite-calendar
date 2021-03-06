import React, {PureComponent} from 'react';
import classNames from 'classnames';
import moment from 'moment';
import get from 'lodash/get'
import Day from '../Day';
const style = require('./Month.scss');

export default class Month extends PureComponent {
	shouldComponentUpdate(nextProps) {
		return (!nextProps.isScrolling && !this.props.isScrolling);
	}
	renderRows() {
		let {disabledDates, disabledDays, displayDate, locale, maxDate, minDate, onDaySelect, rowHeight, rows, selectedDate, today, theme, overlay} = this.props;
		let currentYear = today.date.year();
		let monthShort = displayDate.format('MMM');
		let monthRows = [];
		let day = 0;
		let isDisabled = false;
		let isSelected = false;
		let isToday = false;
		let row, date, days;

		// Oh the things we do in the name of performance...
		for (let i = 0, len = rows.length; i < len; i++) {
			row = rows[i];
			days = [];

			for (let k = 0, len = row.length; k < len; k++) {
				date = row[k];
				day++;

				isSelected = (selectedDate && date.yyyymmdd == selectedDate.yyyymmdd);
				isToday = (today && date.yyyymmdd == today.yyyymmdd);
				isDisabled = (
					minDate && date.yyyymmdd < minDate.yyyymmdd ||
					maxDate && date.yyyymmdd > maxDate.yyyymmdd ||
					disabledDays && disabledDays.length && disabledDays.indexOf(date.date.day()) !== -1 ||
					disabledDates && disabledDates.length && disabledDates.indexOf(date.yyyymmdd) !== -1
				);
				const overlayData = get(overlay, 'data', [])
				const findOverlay = overlayData.find((o) => moment(o.date).format('YYYYMMDD') === date.yyyymmdd)

				days[k] = (
					<Day
						key={`day-${day}`}
						currentYear={currentYear}
						date={date}
						day={day}
						handleDayClick={onDaySelect}
						isDisabled={isDisabled}
						isToday={isToday}
						isSelected={isSelected}
						locale={locale}
						monthShort={monthShort}
						theme={theme}
						overlay={findOverlay}
						CustomOverlay={get(overlay, 'component')}
					/>
				);
			}
			monthRows[i] = (
				<ul className={classNames(style.row, {[style.partial]: row.length !== 7})} style={{height: rowHeight}} key={`Row-${i}`} role="row" aria-label={`Week ${i + 1}`}>
					{days}
				</ul>
			);
		}

		return monthRows;
	}
	render() {
		let {displayDate, today, rows, showOverlay, rowStyle, theme} = this.props;

		return (
			<div className={style.root} style={rowStyle}>
				<div className={style.rows}>
					{this.renderRows()}
					{showOverlay &&
						<label className={classNames(style.label, {[style.partialFirstRow] : (rows[0].length !== 7)})} style={theme && theme.overlayColor && {backgroundColor: theme.overlayColor}}>
							<span>{`${displayDate.format('MMMM')}${(!displayDate.isSame(today.date, 'year')) ? ' ' + displayDate.year() : ''}`}</span>
						</label>
					}
				</div>
			</div>
		);
	}
}
