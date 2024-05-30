'use client';

import Footer from '@/components/main/Footer';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import SelectCategory from '@/components/statistics/SelectCategory';
import Month from '@/components/statistics/Month';
import MonthBarChart from '@/components/statistics/MonthBarChart';
import { createClient } from '@/app/utils/supabase/client';
import { fetchMonthlyTransactions } from '../utils/db';
import { categoryChartType, monthlyAllChartDataType } from '@/type';
import { convertBarChartData } from '../utils/convertDataStructure';

const Statistics = () => {
	const supabase = createClient();
	const [dateInfo, setDateInfo] = useState<DateTime>(DateTime.now());

	const manageMonthHandler = (num: number) => {
		const newDate = dateInfo.plus({ month: num });
		setDateInfo(newDate);
	};

	const [seletedCategory, setSeletedCategory] = useState<string>('All');
	const [monthlyExpenseChartData, setExpenseChartData] =
		useState<categoryChartType>([]);
	const [monthlyDepositChartData, setDepositChartData] =
		useState<categoryChartType>([]);
	const [monthlyAllChartData, setMonthlyAllChartData] =
		useState<monthlyAllChartDataType>([]);

	useEffect(() => {
		const getMonthlyTransactions = async () => {
			const { montlyExpenseTransactionData, montlyDepositTransactionData } =
				await fetchMonthlyTransactions(supabase, dateInfo);

			const {
				monthlyExpenseChartData,
				monthlyDepositChartData,
				monthlyAllChartData,
			} = convertBarChartData({
				montlyExpenseTransactionData,
				montlyDepositTransactionData,
				dateInfo,
			});

			setExpenseChartData(monthlyExpenseChartData);
			setDepositChartData(monthlyDepositChartData);
			setMonthlyAllChartData(monthlyAllChartData);
		};
		getMonthlyTransactions();
	}, [dateInfo, supabase]);

	return (
		<>
			<Month
				displayMonth={dateInfo.toFormat('LLL')}
				manageMonthHandler={manageMonthHandler}
			/>
			<SelectCategory
				seletedCategory={seletedCategory}
				setSeletedCategory={setSeletedCategory}
			/>
			<MonthBarChart
				seletedCategory={seletedCategory}
				expenseChartData={monthlyExpenseChartData}
				depositChartData={monthlyDepositChartData}
				monthlyAllChartData={monthlyAllChartData}
			/>
			<Footer />
		</>
	);
};

export default Statistics;
