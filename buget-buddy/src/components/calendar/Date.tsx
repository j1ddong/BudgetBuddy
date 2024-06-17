'use client';

import { cx } from '@/app/utils/classname.utils';
import { Text } from '@mantine/core';
import { DateTransactionDirDataType } from '@/type';

type CalendarDateProps = {
	date: number;
	isSunday: boolean;
	isCurrMonth: boolean;
	dateTransaction: DateTransactionDirDataType;
};

const Date = ({
	date,
	isSunday,
	isCurrMonth,
	dateTransaction,
}: CalendarDateProps) => {
	console.log(dateTransaction);
	return (
		<>
			<div
				className={cx(
					'date',
					isCurrMonth ? '' : 'out-month',
					isSunday ? 'sunday' : ''
				)}
			>
				{date}
				{dateTransaction &&
					dateTransaction.map((data, idx) => (
						<div key={idx}>
							<Text size='xs'>
								{data.amount.amount_to
									? data.amount.amount_to
									: data.amount.amount}
							</Text>
						</div>
					))}
			</div>
		</>
	);
};

export const CalendarDate = Date;
