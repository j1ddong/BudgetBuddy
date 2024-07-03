'use client';

import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import styles from '@/app/statistics/statistics.module.css';
import CurrencyChart from './Currency.chart';

const ExchangeStatistics = ({ dateInfo }: { dateInfo: DateTime }) => {
	const exchageStatisticData = useRef<{
		[currency: string]: {
			account_from: string;
			account_to: string;
			amount_to: number;
			amount_from: number;
		};
	}>({});
	// const [exchangeStatistics, setExchangeStatistics] = useState<{
	// 	[currency: string]: {
	// 		account_from: string;
	// 		account_to: string;
	// 		amount_to: number;
	// 		amount_from: number;
	// 	};
	// }>({});
	const [currencies, setCurrencies] = useState<string[]>([]);

	const [selectedCurrency, setSeletedCurrency] = useState<string>('');

	useEffect(() => {
		const getExchangeStatistics = async () => {
			const res = await fetch('/api/transactions/monthly/exchange', {
				method: 'POST',
				body: JSON.stringify({ dateInfo }),
			});
			const data = await res.json();
			setCurrencies(Object.keys(data));
			exchageStatisticData.current = data;
			setSeletedCurrency(Object.keys(data)[0]);
		};
		getExchangeStatistics();
	}, [dateInfo]);

	return (
		<div>
			<div className={styles.exchangeCurrency}>
				{currencies.map((data, idx) => (
					<b onClick={() => setSeletedCurrency(data)} key={idx}>
						{data}
					</b>
				))}
			</div>
			<CurrencyChart
				dateInfo={dateInfo}
				selectedCurrency={selectedCurrency}
				selectedCurrencyExchangeData={
					exchageStatisticData.current[selectedCurrency]
				}
			/>
		</div>
	);
};

export default ExchangeStatistics;
