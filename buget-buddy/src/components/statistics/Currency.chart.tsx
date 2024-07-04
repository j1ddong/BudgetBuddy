'use client';
import { LineChart } from '@mantine/charts';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import statisticsStyles from '@/app/statistics/statistics.module.css';
import { NumberInput } from '@mantine/core';

type CurrencyChartProps = {
	dateInfo: DateTime;
	selectedCurrency: string;
	selectedCurrencyExchangeData: any;
};

const CurrencyChart = ({
	dateInfo,
	selectedCurrency,
	selectedCurrencyExchangeData,
}: CurrencyChartProps) => {
	const [toCurrency, setToCurrency] = useState<string>('');
	const [rateStatisticData, setRateStatisticDate] = useState<{}[]>([]);
	const [othersRateStatistics, setOthersRateStatistics] = useState<{
		highestRate: number;
		lowestRate: number;
		averageRate: number;
	}>({
		highestRate: 0,
		lowestRate: 0,
		averageRate: 0,
	});
	const [inputValue, setInputValue] = useState<string | number>('');

	useEffect(() => {
		const getExchangeCurrencyRate = async () => {
			const res = await fetch('/api/transactions/monthly/exchange_rate', {
				method: 'POST',
				body: JSON.stringify({
					dateInfo,
					currency_from: selectedCurrencyExchangeData?.account_from,
					currency_to: selectedCurrencyExchangeData?.account_to,
				}),
			});
			const data = await res.json();

			const rateTempData: { date: any }[] = [];
			data?.forEach((rateData: any) => {
				rateTempData.push({ date: rateData.date, [toCurrency]: rateData.rate });
			});

			setRateStatisticDate(rateTempData);

			setToCurrency(selectedCurrency.split('-')[1]);
		};
		const getOtherExchangeCurrencyRate = async () => {
			const res = await fetch('/api/transactions/monthly/other_exchange_rate', {
				method: 'POST',
				body: JSON.stringify({
					dateInfo,
					currency_from: selectedCurrencyExchangeData?.account_from,
					currency_to: selectedCurrencyExchangeData?.account_to,
				}),
			});
			const data = await res.json();
			setOthersRateStatistics(data);
		};
		if (selectedCurrencyExchangeData) {
			getExchangeCurrencyRate();
			getOtherExchangeCurrencyRate();
		}
	}, [dateInfo, selectedCurrency, selectedCurrencyExchangeData, toCurrency]);
	const minRange = (othersRateStatistics.lowestRate * 0.95).toFixed(2);
	const maxRange = (othersRateStatistics.highestRate * 1.05).toFixed(2);

	return (
		<div>
			{selectedCurrency} &nbsp;
			{selectedCurrencyExchangeData &&
				selectedCurrencyExchangeData?.amount_from + ' >'}
			&nbsp;
			{selectedCurrencyExchangeData?.amount_to}
			{rateStatisticData.length > 0 && (
				<LineChart
					h={300}
					data={rateStatisticData}
					dataKey='date'
					series={[{ name: `${toCurrency}`, color: 'indigo.6' }]}
					curveType='linear'
					yAxisProps={{
						domain: [Number(minRange), Number(maxRange)],
					}}
				/>
			)}
			<div className={statisticsStyles.exchangeInput}>
				<p>Amount</p>
				<NumberInput
					value={inputValue}
					onChange={setInputValue}
					allowNegative={false}
					size='sm'
				/>
			</div>
			{rateStatisticData.length > 0 && (
				<div className={statisticsStyles.otherExchangeBox}>
					<p>For a month Others exchanged at</p>
					<p>
						<b>Highest Rate: </b>
						{othersRateStatistics.highestRate} {'  '}
						{inputValue &&
							Number(inputValue) * othersRateStatistics.highestRate +
								toCurrency}
					</p>
					<p>
						<b>Lowest Rate: </b>
						{othersRateStatistics.lowestRate} {'  '}
						{inputValue &&
							Number(inputValue) * othersRateStatistics.lowestRate + toCurrency}
					</p>
					<p>
						<b>Average Rate: </b>
						{othersRateStatistics.averageRate} {'  '}
						{inputValue &&
							Number(inputValue) * othersRateStatistics.averageRate +
								toCurrency}
					</p>
				</div>
			)}
		</div>
	);
};

export default CurrencyChart;
