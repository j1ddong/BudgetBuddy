'use client';

import { NativeSelect, Select } from '@mantine/core';
import mainStyles from '@/app/page.module.css';
import { createClient } from '@/app/utils/supabase/client';
import { useEffect, useState } from 'react';
import { fetchDayExpenseTransactions } from '@/app/utils/db';

type DayAmountBoxPropType = {
	year: number;
	month: number;
	day: number;
};

const categoriesList = ['Expense', 'Deposit', 'Transfer', 'Exchange'];

const DayAmountBox = ({ year, month, day }: DayAmountBoxPropType) => {
	const supabase = createClient();

	const [category, setCategory] = useState<string | null>('Expense');
	const [transactionHistory, setTransactionHistory] =
		useState<transactionHistoryType>([]);

	useEffect(() => {
		const getDayExpenseTransactions = async () => {
			const { data: transactionData, error } =
				await fetchDayExpenseTransactions(supabase, year, month, day);

			const expenseTransactionHistory: transactionHistoryType = [];

			transactionData?.forEach((transaction) => {
				expenseTransactionHistory.push({
					id: transaction.id,
					account: transaction.accounts.display_name,
					category: transaction.categories.display_name,
					amount: transaction.expense_transactions[0].amount,
				});
			});
			setTransactionHistory(expenseTransactionHistory);
			console.log('history', expenseTransactionHistory);
		};
		getDayExpenseTransactions();
	}, [supabase, day, month, year]);

	return (
		<>
			<div className={mainStyles.dayAmountContainer}>
				<NativeSelect />
				<div>
					<p>Amount</p>
					<Select
						value={category}
						data={categoriesList}
						onChange={setCategory}
					/>
				</div>
				<p>275 USD</p>
			</div>
			<div className={mainStyles.transactionDetailContainer}>
				<p>Transactions</p>
				{transactionHistory.map((history) => (
					<div key={history.id}>
						<p>
							{history.category} {history.amount}
						</p>
					</div>
				))}
			</div>
		</>
	);
};

export default DayAmountBox;
