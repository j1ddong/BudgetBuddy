import { categoryChartType, monthlyAllChartDataType } from '@/type';
import { BarChart } from '@mantine/charts';

type MonthBarChartPropsType = {
	seletedCategory: string;
	expenseChartData: categoryChartType;
	depositChartData: categoryChartType;
	exchangeChartData: categoryChartType;
	monthlyAllChartData: monthlyAllChartDataType;
};

const MonthBarChart = ({
	seletedCategory,
	expenseChartData,
	depositChartData,
	exchangeChartData,
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
			return exchangeChartData;
		}
		return [];
	};

	return (
		<BarChart
			h={300}
			data={setChartData(seletedCategory)}
			dataKey='month'
			series={[
				{ name: 'deposit', color: 'violet.6' },
				{ name: 'expense', color: 'blue.6' },
				{ name: 'exchange', color: 'green.6' },
			]}
			tickLine='y'
		/>
	);
};

export default MonthBarChart;
