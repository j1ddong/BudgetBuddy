import {
	AccountDataType,
	categoryChartType,
	monthlyAllChartDataType,
	monthlyCategorySumType,
	selectDataMapType,
	transactionHistoryType,
	monthCategorySum,
	categoryPieType,
	MonthExchangeTransactionDataType,
} from '@/type';
import { DateTime } from 'luxon';
import { COLORS, months } from './const';

export const mapAccountData = (accountData: AccountDataType) => {
	const accountDataMap: selectDataMapType = [];
	accountData?.forEach((account) => {
		accountDataMap.push({ label: account.display_name, value: account.id });
	});
	return accountDataMap;
};

export const mapCategoryTransactionDataAndGetTotalAmount = (
	transactionData: any[],
	category: string | null
) => {
	const categoryHistory: transactionHistoryType = [];
	let totalAmount = 0;

	if (category === 'transfer') {
		transactionData?.forEach((transaction) => {
			const transferAmount =
				transaction.from === undefined
					? transaction.to[0].amount
					: -transaction.from[0].amount;

			totalAmount += transferAmount;
			categoryHistory.push({
				id: transaction.id,
				account: transaction.accounts.display_name,
				category: transaction.categories.display_name,
				amount: transferAmount,
			});
		});

		return { categoryHistory, totalAmount };
	}

	if (category === 'exchange') {
		transactionData?.forEach((transaction) => {
			const exchangeAmount =
				transaction.from === undefined
					? transaction.to[0].amount_to
					: -transaction.from[0].amount_from;

			totalAmount += exchangeAmount;
			categoryHistory.push({
				id: transaction.id,
				account: transaction.accounts.display_name,
				category: transaction.categories.display_name,
				amount: exchangeAmount,
			});
		});
		return { categoryHistory, totalAmount };
	}

	// deposit, expense
	transactionData?.forEach((transaction) => {
		totalAmount += transaction.detail[0].amount;
		categoryHistory.push({
			id: transaction.id,
			account: transaction.accounts.display_name,
			category: transaction.categories.display_name,
			amount: transaction.detail[0].amount,
		});
	});

	return { categoryHistory, totalAmount };
};

export const getCurrency = (
	account_id: string | null,
	accountData: AccountDataType
) => {
	const accont = accountData?.find((account) => account.id === account_id);
	return accont?.currencies.display_name;
};

const getMonthlyCategoryChartData = (
	monthlyTransactionData: any[] | null,
	dateInfo: DateTime,
	category: string
) => {
	const monthlyCategorySum: monthlyCategorySumType = {};

	monthlyTransactionData?.forEach((data) => {
		const monthIdx: number = Number(data.date.slice(5, 7));
		const transactionType = data.categories.transaction_type;

		let amount = 'amount';
		if (transactionType === 'exchange') {
			amount = 'amount_to';
		}

		if (monthlyCategorySum[monthIdx]) {
			monthlyCategorySum[monthIdx][transactionType] += data.amount[0][amount];
		} else {
			monthlyCategorySum[monthIdx] = {
				[transactionType]: data.amount[0][amount],
			};
		}
	});

	const monthlyCategoryChartData: categoryChartType = [];

	for (let num = 5; num > -1; num--) {
		const monthIdx: number = dateInfo.minus({ month: num }).month;
		const month: string = months[monthIdx - 1];
		if (monthlyCategorySum[monthIdx]) {
			monthlyCategoryChartData.push({ month, ...monthlyCategorySum[monthIdx] });
		} else {
			monthlyCategoryChartData.push({ month, [category]: 0 });
		}
	}
	return monthlyCategoryChartData;
};

export const convertBarChartData = ({
	monthlyExpenseTransactionData,
	monthlyDepositTransactionData,
	dateInfo,
}: any) => {
	const monthlyExpenseChartData: categoryChartType =
		getMonthlyCategoryChartData(
			monthlyExpenseTransactionData,
			dateInfo,
			'expense'
		);
	const monthlyDepositChartData: categoryChartType =
		getMonthlyCategoryChartData(
			monthlyDepositTransactionData,
			dateInfo,
			'deposit'
		);

	const monthlyAllChartData: monthlyAllChartDataType = [];
	for (let idx = 0; idx < 6; idx++) {
		const month = monthlyExpenseChartData[idx].month;
		const expense = monthlyExpenseChartData[idx].expense;
		const deposit = monthlyDepositChartData[idx].deposit;
		monthlyAllChartData.push({ month, expense, deposit });
	}
	return {
		monthlyExpenseChartData,
		monthlyDepositChartData,
		monthlyAllChartData,
	};
};

const getMonthCategoryPieData = (
	monthlyTransactionData: any[] | null,
	dateInfo: DateTime,
	colorIdx: number
) => {
	const monthCategorySum: monthCategorySum = {};
	const categoryList: string[] = [];

	monthlyTransactionData?.forEach((data) => {
		const categoryType: string = data.categories.display_name;
		const currentMonth: number = dateInfo.month;
		const dataMonth: number = Number(data.date.slice(5, 7));

		if (currentMonth > dataMonth) {
			return;
		}
		let amount = 'amount';
		if (categoryType === 'Exchange') {
			amount = 'amount_to';
		}
		if (monthCategorySum[categoryType]) {
			monthCategorySum[categoryType] += data.amount[0][amount];
		} else {
			monthCategorySum[categoryType] = data.amount[0][amount];
			categoryList.push(categoryType);
		}
	});

	const monthCategoryPieData: categoryPieType = [];

	categoryList.forEach((category, idx) => {
		const color = COLORS[idx + colorIdx];
		monthCategoryPieData.push({
			name: category,
			value: monthCategorySum[category],
			color,
		});
	});

	const returnColorIdx = 1 + 2;

	return { monthCategoryPieData, returnColorIdx };
};

export const convertPieChartData = ({
	monthlyExpenseTransactionData,
	monthlyDepositTransactionData,
	monthlyExchangeTransactionData,
	dateInfo,
}: any) => {
	const colorIdx = 0;

	const {
		monthCategoryPieData: monthExpensePieData,
		returnColorIdx: expenseColorIdx,
	}: { monthCategoryPieData: categoryPieType; returnColorIdx: number } =
		getMonthCategoryPieData(monthlyExpenseTransactionData, dateInfo, colorIdx);

	const {
		monthCategoryPieData: monthDepositPieData,
		returnColorIdx: depositColorIdx,
	}: { monthCategoryPieData: categoryPieType; returnColorIdx: number } =
		getMonthCategoryPieData(
			monthlyDepositTransactionData,
			dateInfo,
			expenseColorIdx
		);

	const {
		monthCategoryPieData: monthExchangePieData,
	}: { monthCategoryPieData: categoryPieType } = getMonthCategoryPieData(
		monthlyExchangeTransactionData,
		dateInfo,
		depositColorIdx
	);

	const monthAllPieData: categoryPieType = monthExpensePieData.concat(
		monthDepositPieData,
		monthExchangePieData
	);
	return {
		monthExpensePieData,
		monthDepositPieData,
		monthExchangePieData,
		monthAllPieData,
	};
};
