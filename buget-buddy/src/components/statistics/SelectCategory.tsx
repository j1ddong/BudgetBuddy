'use client';

import { statisticsCategoryList } from '@/app/utils/const';
import statisticsStyles from '@/app/statistics/statistics.module.css';
import { Dispatch, SetStateAction } from 'react';

type SelectCategoryPropsType = {
	seletedCategory: string;
	setSeletedCategory: Dispatch<SetStateAction<string>>;
};

const SelectCategory = ({
	seletedCategory,
	setSeletedCategory,
}: SelectCategoryPropsType) => {
	return (
		<div className={statisticsStyles.categoryContainer}>
			{statisticsCategoryList.map((categoryName) => {
				return (
					<p
						onClick={() => setSeletedCategory(categoryName)}
						className={
							seletedCategory === categoryName ? statisticsStyles.active : ''
						}
						key={categoryName}
					>
						{categoryName}
					</p>
				);
			})}
		</div>
	);
};

export default SelectCategory;
