'use client';

import { cx } from '@/app/utils/classname.utils';
import { Popover, Text } from '@mantine/core';
import { DateTransactionDirDataType } from '@/type';
import { useDisclosure } from '@mantine/hooks';

type CalendarDateProps = {
	date: number;
	isSunday: boolean;
	isCurrMonth: boolean;
	dateTransaction: {
		dayDeposit: number;
		dayExpense: number;
		detail: DateTransactionDirDataType;
	};
};

const Date = ({
	date,
	isSunday,
	isCurrMonth,
	dateTransaction,
}: CalendarDateProps) => {
	const [opened, { close, open }] = useDisclosure(false);
	return (
		<>
			<Popover position='bottom' withArrow shadow='md' opened={opened}>
				<Popover.Target>
					<div
						onMouseEnter={open}
						onMouseLeave={close}
						className={cx(
							'date',
							isCurrMonth ? '' : 'out-month',
							isSunday ? 'sunday' : ''
						)}
					>
						{date}
						{dateTransaction && (
							<div>
								<Text size='xs' className='deposit'>
									{dateTransaction.dayDeposit}
								</Text>
								<Text size='xs' className='expense'>
									{dateTransaction.dayExpense}
								</Text>
							</div>
						)}
					</div>
				</Popover.Target>
				{dateTransaction && (
					<Popover.Dropdown style={{ pointerEvents: 'none' }}>
						{dateTransaction.detail.map((transaction, idx) => (
							<div key={idx}>
								<Text size='sm'>
									{transaction.category}
									{transaction.amount}
								</Text>
							</div>
						))}
					</Popover.Dropdown>
				)}
			</Popover>
		</>
	);
};

export const CalendarDate = Date;
