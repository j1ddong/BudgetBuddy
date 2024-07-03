import { categoryChartType, monthlyAllChartDataType } from '@/type';
import { BarChart } from '@mantine/charts';
import ExchangeStatistics from './Exchange.statistics';
import { DateTime } from 'luxon';

type MonthBarChartPropsType = {
	seletedCategory: string;
	dateInfo: DateTime;
	expenseChartData: categoryChartType;
	depositChartData: categoryChartType;
	monthlyAllChartData: monthlyAllChartDataType;
};

const MonthBarChart = ({
	seletedCategory,
	dateInfo,
	expenseChartData,
	depositChartData,
	monthlyAllChartData,
}: MonthBarChartPropsType) => {
	const setChartData = (seletedCategory: string) => {
		if (seletedCategory === 'All') {
			return monthlyAllChartData;
		} else if (seletedCategory === 'Expense') {
			return expenseChartData;
		} else if (seletedCategory === 'Deposit') {
			return depositChartData;
		} else if (seletedCategory === 'Exchange') {
			return [];
		}
		return [];
	};

	if (seletedCategory === 'Exchange') {
		return <ExchangeStatistics dateInfo={dateInfo} />;
	}

	return (
		<BarChart
			h={300}
			data={setChartData(seletedCategory)}
			dataKey='month'
			series={[
				{ name: 'deposit', color: 'violet.6' },
				{ name: 'expense', color: 'blue.6' },
			]}
			tickLine='y'
		/>
	);
};

export default MonthBarChart;
