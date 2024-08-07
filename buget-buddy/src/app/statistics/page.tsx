'use client';

import Footer from '@/components/main/Footer';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import SelectCategory from '@/components/statistics/SelectCategory';
import Month from '@/components/statistics/Month';
import MonthBarChart from '@/components/statistics/MonthBarChart';
import {
	categoryChartType,
	categoryPieType,
	monthlyAllChartDataType,
} from '@/type';
import {
	convertBarChartData,
	convertPieChartData,
} from '../utils/convertDataStructure';
import CategoryPieChart from '@/components/statistics/CategoryPieChart';
import { createClient } from '../utils/supabase/client';

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

	const [monthExpensePieData, setExpensePieData] = useState<categoryPieType>(
		[]
	);
	const [monthDepositPieData, setDepositPieData] = useState<categoryPieType>(
		[]
	);
	const [monthAllPieData, setMonthAllPieData] = useState<categoryPieType>([]);

	useEffect(() => {
		const getMonthlyTransactions = async () => {
			const res = await fetch('/api/transactions/monthly', {
				method: 'POST',
				body: JSON.stringify({ dateInfo }),
			});
			const { monthlyExpenseTransactionData, monthlyDepositTransactionData } =
				await res.json();
			const {
				monthlyExpenseChartData,
				monthlyDepositChartData,
				monthlyAllChartData,
			} = convertBarChartData({
				monthlyExpenseTransactionData,
				monthlyDepositTransactionData,
				dateInfo,
			});

			setExpenseChartData(monthlyExpenseChartData);
			setDepositChartData(monthlyDepositChartData);
			setMonthlyAllChartData(monthlyAllChartData);

			const { monthExpensePieData, monthDepositPieData, monthAllPieData } =
				convertPieChartData({
					monthlyExpenseTransactionData,
					monthlyDepositTransactionData,
					dateInfo,
				});
			setExpensePieData(monthExpensePieData);
			setDepositPieData(monthDepositPieData);
			setMonthAllPieData(monthAllPieData);
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
				dateInfo={dateInfo}
				expenseChartData={monthlyExpenseChartData}
				depositChartData={monthlyDepositChartData}
				monthlyAllChartData={monthlyAllChartData}
			/>
			<CategoryPieChart
				seletedCategory={seletedCategory}
				monthExpensePieData={monthExpensePieData}
				monthDepositPieData={monthDepositPieData}
				monthAllPieData={monthAllPieData}
			/>
			<Footer />
		</>
	);
};

export default Statistics;
