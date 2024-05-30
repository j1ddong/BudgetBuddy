import {
	AccountDataType,
	categoryChartType,
	monthlyAllChartDataType,
	monthlyCategorySumType,
	selectDataMapType,
	transactionHistoryType,
} from '@/type';
import { DateTime } from 'luxon';
import { months } from './const';

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
	montlyTransactionData: any[] | null,
	dateInfo: DateTime,
	category: string
) => {
	const monthlyCategorySum: monthlyCategorySumType = {};

	montlyTransactionData?.forEach((data) => {
		const monthIdx: number = Number(data.date.slice(5, 7));
		const transactionType = data.categories.transaction_type;

		if (monthlyCategorySum[monthIdx]) {
			monthlyCategorySum[monthIdx][transactionType] += data.amount[0].amount;
		} else {
			monthlyCategorySum[monthIdx] = {
				[transactionType]: data.amount[0].amount,
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
	montlyExpenseTransactionData,
	montlyDepositTransactionData,
	dateInfo,
}: any) => {
	const monthlyExpenseChartData: categoryChartType =
		getMonthlyCategoryChartData(
			montlyExpenseTransactionData,
			dateInfo,
			'expense'
		);
	const monthlyDepositChartData: categoryChartType =
		getMonthlyCategoryChartData(
			montlyDepositTransactionData,
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
