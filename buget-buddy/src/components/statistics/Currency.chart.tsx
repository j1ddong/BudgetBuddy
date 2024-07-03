'use client';
import { LineChart } from '@mantine/charts';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import statisticsStyles from '@/app/statistics/statistics.module.css';

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
				/>
			)}
			{rateStatisticData.length > 0 && (
				<div className={statisticsStyles.otherExchangeBox}>
					<p>For a month Others exchanged at</p>
					<p>
						<b>Highest Rate: </b>
						{othersRateStatistics.highestRate}
					</p>
					<p>
						<b>Lowest Rate: </b>
						{othersRateStatistics.lowestRate}
					</p>
					<p>
						<b>Average Rate: </b>
						{othersRateStatistics.averageRate}
					</p>
				</div>
			)}
		</div>
	);
};

export default CurrencyChart;
