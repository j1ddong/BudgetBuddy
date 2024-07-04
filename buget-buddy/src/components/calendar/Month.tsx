'use client';

import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import { CalendarDate } from './Date';
import { useMonthTransactionData } from '@/contexts/monthTransactionContext/monthTransactions.provider';
import { DateTransactionDirType } from '@/type';

type CalendarMonthProps = {
	year: number;
	month: number;
};

function makeWeekRows(
	year: number,
	month: number,
	dateTransactionDir: DateTransactionDirType
): ReactNode[][] {
	const todayIdx = DateTime.local(year, month, 1).weekday;
	let date = DateTime.local(year, month, 1).minus({
		days: todayIdx === 7 ? 0 : todayIdx,
	});

	const weekRows: ReactNode[][] = [];
	let week = 0;
	do {
		weekRows[week] = [];
		for (let i = 0; i < 7; i++) {
			const dateMonth = date.month < 10 ? '0' + date.month : date.month;
			const dateDay = date.day < 10 ? '0' + date.day : date.day;
			const dataIdx = `${date.year}-${dateMonth}-${dateDay}`;

			weekRows[week].push(
				<CalendarDate
					key={date.day}
					date={date.day}
					isSunday={date.weekday === 7}
					isCurrMonth={date.month === month}
					dateTransaction={dateTransactionDir[dataIdx]}
				/>
			);
			date = date.plus({ day: 1 });
		}
		week++;
	} while (date.month === month);

	return weekRows;
}

const Month = ({ year, month }: CalendarMonthProps) => {
	const { dateTransactionDir } = useMonthTransactionData();
	return (
		<>
			<div>
				{makeWeekRows(year, month, dateTransactionDir).map((weekRow, week) => (
					<div key={week} className='week-row'>
						{weekRow}
					</div>
				))}
			</div>
		</>
	);
};

export const CalendarMonth = Month;
