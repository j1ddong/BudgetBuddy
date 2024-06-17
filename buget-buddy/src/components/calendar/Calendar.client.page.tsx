'use client';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { CalendarHeader } from './Header';
import { CalendarMonth } from './Month';

const CalendarClientPage = () => {
	const [year, setYear] = useState<number>(DateTime.now().year);
	const [month, setMonth] = useState<number>(DateTime.now().month);

	const goToRelativeMonth = (months: number) => {
		months = Math.floor(months);
		if (months === 0) return;

		const newDate = DateTime.local(year, month).plus({ months: months });
		setYear(newDate.year);
		setMonth(newDate.month);
	};
	return (
		<>
			<section className='header-section'>
				<CalendarHeader
					year={year}
					month={month}
					goToRelativeMonth={goToRelativeMonth}
				/>
			</section>
			<div className='day-row'>
				<div>Sun</div>
				<div>Mon</div>
				<div>Tue</div>
				<div>Wed</div>
				<div>Thu</div>
				<div>Fri</div>
				<div>Sat</div>
			</div>
			<CalendarMonth year={year} month={month} />
		</>
	);
};

export default CalendarClientPage;
