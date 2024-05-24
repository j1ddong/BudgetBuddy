'use client';

import { Select, Text } from '@mantine/core';
import mainStyles from '@/app/page.module.css';
import { createClient } from '@/app/utils/supabase/client';
import { useEffect, useRef, useState } from 'react';
import { fetchDayCategoryTransactions } from '@/app/utils/db';
import { useAccountData } from '@/contexts/accountContext/accountContext.provider';
import {
	getCurrency,
	mapAccountData,
	mapCategoryTransactionDataAndGetTotalAmount,
} from '@/app/utils/convertDataStructure';
import { categoriesList } from '@/app/utils/const';
import {
	DayDetailBoxPropsType,
	selectDataMapType,
	transactionHistoryType,
} from '@/type';

const DayDetailBox = ({ year, month, day }: DayDetailBoxPropsType) => {
	const supabase = createClient();

	const { accountData } = useAccountData();
	const accountInfoRef = useRef<selectDataMapType | null>(null);
	accountInfoRef.current = mapAccountData(accountData);

	const [account, setAccount] = useState<string | null>(
		accountInfoRef.current[0].value
	);
	const [category, setCategory] = useState<string | null>('expense');
	const [amount, setAmount] = useState<number>(0);
	const [currency, setCurrency] = useState<string | undefined>('');

	const [transactionHistory, setTransactionHistory] =
		useState<transactionHistoryType>([]);

	useEffect(() => {
		if (accountInfoRef.current) {
			setCurrency(getCurrency(account, accountData));

			const getDayCategoryTransactions = async () => {
				const { data: transactionData } = await fetchDayCategoryTransactions(
					supabase,
					{ date: { year, month, day } },
					account,
					category
				);

				const { categoryHistory, totalAmount } =
					mapCategoryTransactionDataAndGetTotalAmount(
						transactionData,
						category
					);
				setTransactionHistory(categoryHistory);
				setAmount(totalAmount);
			};
			getDayCategoryTransactions();
		}
	}, [supabase, day, month, year, category, account, accountData]);

	return (
		<>
			<Select
				value={account}
				data={accountInfoRef.current}
				defaultValue={accountInfoRef.current[0].value}
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
