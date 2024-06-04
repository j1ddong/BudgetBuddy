'use server';

import Footer from '@/components/main/Footer';
import DayMain from '@/components/main/Day.main';
import { supabase } from './utils/supabase/authAdmin';
import { DateTime } from 'luxon';
import { fetchDayCategoryTransactions } from './utils/db';
import {
	mapAccountData,
	mapCategoryTransactionDataAndGetTotalAmount,
} from './utils/convertDataStructure';
import { getAccountInfo } from './api/getAccountInfo';

const Home = async () => {
	const today = DateTime.now();
	const year = today.year;
	const month = today.month;
	const day = today.day;

	const accountData = await getAccountInfo();
	const accountInfo = mapAccountData(accountData);

	const { data: transactionData } = await fetchDayCategoryTransactions(
		supabase,
		{ date: { year, month, day } },
		accountInfo[0].value,
		'expense'
	);
	const { categoryHistory, totalAmount } =
		mapCategoryTransactionDataAndGetTotalAmount(transactionData, 'expense');

	return (
		<>
			<DayMain categoryHistory={categoryHistory} totalAmount={totalAmount} />
			<Footer />
		</>
	);
};
export default Home;
