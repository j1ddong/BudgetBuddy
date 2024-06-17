import { cx } from '@/app/utils/classname.utils';
import { DateTransactionDirDataType } from '@/type';

type CalendarDateProps = {
	date: number;
	isCurrMonth: boolean;
	dateTransaction: DateTransactionDirDataType;
};

const Date = ({ date, isCurrMonth, dateTransaction }: CalendarDateProps) => {
	return (
		<>
			<div className={cx('date', isCurrMonth ? '' : 'out-month')}>
				{date}
				{dateTransaction &&
					dateTransaction.map((data, idx) => (
						<div key={idx}>
							<p>
								{data.amount.amount_to
									? data.amount.amount_to
									: data.amount.amount}
							</p>
							{data.category}
						</div>
					))}
			</div>
		</>
	);
};

export const CalendarDate = Date;
