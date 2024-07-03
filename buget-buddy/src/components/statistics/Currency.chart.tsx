'use client';
import { LineChart } from '@mantine/charts';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

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

			console.log(data);
			const rateTempData: {}[] = [];
			data?.forEach((rateData: any) => {
				rateTempData.push({ date: rateData.date, [toCurrency]: rateData.rate });
			});
			setRateStatisticDate(rateTempData);

			setToCurrency(selectedCurrency.split('-')[1]);
		};
		if (selectedCurrencyExchangeData) getExchangeCurrencyRate();
	}, [dateInfo, selectedCurrency, selectedCurrencyExchangeData, toCurrency]);

	console.log(selectedCurrencyExchangeData);
	return (
		<div>
			{selectedCurrency} &nbsp;
			{selectedCurrencyExchangeData &&
				selectedCurrencyExchangeData?.amount_from + '>'}
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
			<div>최고, 최저, 평균 환율</div>
		</div>
	);
};

export default CurrencyChart;
