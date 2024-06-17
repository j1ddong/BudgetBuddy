'use client';
import { DateTime } from 'luxon';

type CalendarHeaderProps = {
	year: number;
	month: number;
	goToRelativeMonth: (months: number) => void;
};

const Header = ({ year, month, goToRelativeMonth }: CalendarHeaderProps) => {
	return (
		<div className='calendar-header'>
			<p onClick={() => goToRelativeMonth(-1)}>&lt;</p>
			<h1>{DateTime.local(year, month).toFormat('MMM yyyy')}</h1>
			<p onClick={() => goToRelativeMonth(1)}>&gt;</p>
		</div>
	);
};

export const CalendarHeader = Header;
