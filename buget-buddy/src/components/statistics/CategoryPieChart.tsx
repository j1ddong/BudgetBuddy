import { categoryPieType } from '@/type';
import { PieChart } from '@mantine/charts';
import statisticsStyles from '@/app/statistics/statistics.module.css';

const data = [
	{ name: 'USA', value: 400, color: 'indigo.6' },
	{ name: 'India', value: 300, color: 'yellow.6' },
	{ name: 'Japan', value: 300, color: 'teal.6' },
	{ name: 'Other', value: 200, color: 'gray.6' },
];

type CategoryPieChartPropsType = {
	seletedCategory: string;
	monthExpensePieData: categoryPieType;
	monthDepositPieData: categoryPieType;
	monthAllPieData: categoryPieType;
};

const CategoryPieChart = ({
	seletedCategory,
	monthExpensePieData,
	monthDepositPieData,
	monthAllPieData,
}: CategoryPieChartPropsType) => {
	const setPieData = (seletedCategory: string) => {
		if (seletedCategory === 'All') {
			return monthAllPieData;
		} else if (seletedCategory === 'Expense') {
			return monthExpensePieData;
		} else if (seletedCategory === 'Deposit') {
			return monthDepositPieData;
		}
		return [];
	};
	return (
		<div className={statisticsStyles.pieChartContainer}>
			<div>
				<PieChart data={setPieData(seletedCategory)} withTooltip />
			</div>
			<p>&lt;Month {seletedCategory} Category Statistics&gt;</p>
		</div>
	);
};

export default CategoryPieChart;
