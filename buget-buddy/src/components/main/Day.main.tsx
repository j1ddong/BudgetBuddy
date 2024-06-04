'use client';

import DayDetailBox from '@/components/main/DayDetailBox';
import mainStyles from '@/app/page.module.css';
import { Button } from '@mantine/core';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useState } from 'react';
import { transactionHistoryType } from '@/type';

type DayMainPropsType = {
	categoryHistory: transactionHistoryType;
	totalAmount: number;
};

const DayMain = ({ categoryHistory, totalAmount }: DayMainPropsType) => {
	const [year, setYear] = useState<number>(DateTime.now().year);
	const [month, setMonth] = useState<number>(DateTime.now().month);
	const [displayMonth, setDisplayMonth] = useState<string>(
		DateTime.now().toFormat('LLL')
	);
	const [day, setDay] = useState<number>(DateTime.now().day);

	const manageDayHandler = (days: number) => {
		const newDate = DateTime.local(year, month, day).plus({ days });
		setYear(newDate.year);
		setMonth(newDate.month);
		setDisplayMonth(newDate.toFormat('LLL'));
		setDay(newDate.day);
	};

	return (
		<>
			<div className={mainStyles.dayContainer}>
				<span onClick={() => manageDayHandler(-1)}>&lt;</span>
				<p>
					{year} &nbsp;
					{displayMonth}&nbsp;
					{day}
				</p>
				<span onClick={() => manageDayHandler(1)}>&gt;</span>
			</div>
			<DayDetailBox
				year={year}
				month={month}
				day={day}
				categoryHistory={categoryHistory}
				totalAmount={totalAmount}
			/>
			<Button fullWidth component={Link} href={'/new-transaction'}>
				Add Transactions
			</Button>
		</>
	);
};
export default DayMain;
