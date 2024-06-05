import { categoryPieType } from '@/type';
import { PieChart } from '@mantine/charts';
import statisticsStyles from '@/app/statistics/statistics.module.css';

type CategoryPieChartPropsType = {
	seletedCategory: string;
	monthExpensePieData: categoryPieType;
	monthDepositPieData: categoryPieType;
	monthExchangePieData: categoryPieType;
	monthAllPieData: categoryPieType;
};

const CategoryPieChart = ({
	seletedCategory,
	monthExpensePieData,
	monthDepositPieData,
	monthExchangePieData,
	monthAllPieData,
}: CategoryPieChartPropsType) => {
	const setPieData = (seletedCategory: string) => {
		if (seletedCategory === 'All') {
			return monthAllPieData;
		} else if (seletedCategory === 'Expense') {
			return monthExpensePieData;
		} else if (seletedCategory === 'Deposit') {
			return monthDepositPieData;
		} else if (seletedCategory === 'Exchange') {
			return monthExchangePieData;
		}
		return [];
	};
	return (
		<div className={statisticsStyles.pieChartContainer}>
			<div>
				<PieChart data={setPieData(seletedCategory)} withTooltip />
			</div>
			{setPieData(seletedCategory).length && (
				<p>&lt; {seletedCategory} Category Statistics&gt; </p>
			)}
		</div>
	);
};

export default CategoryPieChart;
