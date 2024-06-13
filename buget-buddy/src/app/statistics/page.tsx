'use client';

import Footer from '@/components/main/Footer';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import SelectCategory from '@/components/statistics/SelectCategory';
import Month from '@/components/statistics/Month';
import MonthBarChart from '@/components/statistics/MonthBarChart';
import { fetchMonthlyTransactions } from '../utils/db';
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
	const [monthlyExchangeChartData, setExchangeChartData] =
		useState<categoryChartType>([]);
	const [monthlyAllChartData, setMonthlyAllChartData] =
		useState<monthlyAllChartDataType>([]);

	const [monthExpensePieData, setExpensePieData] = useState<categoryPieType>(
		[]
	);
	const [monthDepositPieData, setDepositPieData] = useState<categoryPieType>(
		[]
	);
	const [monthExchangePieData, setExchangePieData] = useState<categoryPieType>(
		[]
	);
	const [monthAllPieData, setMonthAllPieData] = useState<categoryPieType>([]);

	useEffect(() => {
		const getMonthlyTransactions = async () => {
			const {
				monthlyExpenseTransactionData,
				monthlyDepositTransactionData,
				monthlyExchangeTransactionData,
			} = await fetchMonthlyTransactions(supabase, dateInfo);

			const {
				monthlyExpenseChartData,
				monthlyDepositChartData,
				monthlyExchangeChartData,
				monthlyAllChartData,
			} = convertBarChartData({
				monthlyExpenseTransactionData,
				monthlyDepositTransactionData,
				monthlyExchangeTransactionData,
				dateInfo,
			});

			setExpenseChartData(monthlyExpenseChartData);
			setDepositChartData(monthlyDepositChartData);
			setExchangeChartData(monthlyExchangeChartData);
			setMonthlyAllChartData(monthlyAllChartData);

			const {
				monthExpensePieData,
				monthDepositPieData,
				monthExchangePieData,
				monthAllPieData,
			} = convertPieChartData({
				monthlyExpenseTransactionData,
				monthlyDepositTransactionData,
				monthlyExchangeTransactionData,
				dateInfo,
			});
			setExpensePieData(monthExpensePieData);
			setDepositPieData(monthDepositPieData);
			setExchangePieData(monthExchangePieData);
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
				expenseChartData={monthlyExpenseChartData}
				depositChartData={monthlyDepositChartData}
				exchangeChartData={monthlyExchangeChartData}
				monthlyAllChartData={monthlyAllChartData}
			/>
			<CategoryPieChart
				seletedCategory={seletedCategory}
				monthExpensePieData={monthExpensePieData}
				monthDepositPieData={monthDepositPieData}
				monthExchangePieData={monthExchangePieData}
				monthAllPieData={monthAllPieData}
			/>
			<Footer />
		</>
	);
};

export default Statistics;
