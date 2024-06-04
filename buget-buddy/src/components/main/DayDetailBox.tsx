'use client';

import { Select, Text } from '@mantine/core';
import mainStyles from '@/app/page.module.css';
import { useEffect, useState } from 'react';
import { fetchDayCategoryTransactions } from '@/app/utils/db';
import { useAccountData } from '@/contexts/accountContext/accountContext.provider';
import {
	getCurrency,
	mapAccountData,
	mapCategoryTransactionDataAndGetTotalAmount,
} from '@/app/utils/convertDataStructure';
import { categoriesList } from '@/app/utils/const';
import { DayDetailBoxPropsType, transactionHistoryType } from '@/type';
import { supabase } from '@/app/utils/supabase/authAdmin';

const DayDetailBox = ({ year, month, day }: DayDetailBoxPropsType) => {
	const accountData = useAccountData();
	const accountInfo = mapAccountData(accountData);

	const [account, setAccount] = useState<string | null>(accountInfo[0].value);
	const [category, setCategory] = useState<string | null>('expense');
	const [amount, setAmount] = useState<number>(0);
	const [currency, setCurrency] = useState<string | undefined>('');

	const [transactionHistory, setTransactionHistory] =
		useState<transactionHistoryType>([]);

	useEffect(() => {
		setCurrency(getCurrency(account, accountData));
		const getDayCategoryTransactions = async () => {
			const { data: transactionData } = await fetchDayCategoryTransactions(
				supabase,
				{ date: { year, month, day } },
				account,
				category
			);

			const { categoryHistory, totalAmount } =
				mapCategoryTransactionDataAndGetTotalAmount(transactionData, category);

			setTransactionHistory(categoryHistory);
			setAmount(totalAmount);
		};
		getDayCategoryTransactions();
	}, [day, month, year, category, account, accountData]);

	return (
		<>
			<Select
				value={account}
				data={accountInfo}
				defaultValue={accountInfo[0].value}
				onChange={setAccount}
			/>
			<div className={mainStyles.dayAmountContainer}>
				<div>
					<p>Amount</p>
					<Select
						value={category}
						defaultValue='expense'
						data={categoriesList}
						onChange={setCategory}
					/>
				</div>
				<Text fw={500}>
					{amount} {currency}
				</Text>
			</div>
			<div className={mainStyles.transactionDetailContainer}>
				<Text fw={500}>Transactions</Text>
				{transactionHistory.map((history) => (
					<div key={history.id} className={mainStyles.historyContainer}>
						<div>
							<p>{history.category}</p>
							<p>
								{history.amount} {currency}
							</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default DayDetailBox;
