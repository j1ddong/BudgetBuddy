'use client';

import statisticsStyles from '@/app/statistics/statistics.module.css';

type MonthPropsType = {
	displayMonth: string;
	manageMonthHandler: (num: number) => void;
};

const Month = ({ displayMonth, manageMonthHandler }: MonthPropsType) => {
	return (
		<>
			<div className={statisticsStyles.monthContainer}>
				<span onClick={() => manageMonthHandler(-1)}>&lt;</span>
				<p>&nbsp;{displayMonth}&nbsp;</p>
				<span onClick={() => manageMonthHandler(1)}>&gt;</span>
			</div>
		</>
	);
};

export default Month;
