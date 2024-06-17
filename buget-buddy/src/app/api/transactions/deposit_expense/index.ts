import {
	getCategoryId,
	insertNewDepositData,
	insertNewExpenseData,
	insertNewTransactionData,
} from '@/app/utils/db';

export const depositExpenseFormDBInsert = async (
	values: {
		account: string;
		amount: number;
		date: string;
	},
	type: string
) => {
	const { data: categoryData, error: categoryDataErr } =
		await getCategoryId(type);

	if (categoryDataErr) return;

	const { data: newTransactionData, error: newTransactionInsertErr } =
		await insertNewTransactionData(
			values.date,
			values.account,
			categoryData!.id
		);

	if (newTransactionInsertErr) return;

	if (categoryData!.transaction_type === 'expense') {
		const { error: newExpenseInsertError } = await insertNewExpenseData(
			values.account,
			newTransactionData!.id,
			values.amount
		);
		if (newExpenseInsertError) {
			alert('Please try it again');
			return;
		}
	} else {
		const { error: newDepositInsertError } = await insertNewDepositData(
			values.account,
			newTransactionData!.id,
			values.amount
		);
		if (newDepositInsertError) return;
	}
	return 'ok';
};
