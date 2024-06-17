import {
	getCategoryId,
	insertNewTransactionData,
	insertNewTransferData,
} from '@/app/utils/db';

export const transferFormDBInsert = async (
	values: {
		date: string;
		amount: number;
		account_to: string;
		account_from: string;
	},
	type: string
) => {
	const { data: categoryData, error: categoryDataErr } =
		await getCategoryId(type);

	if (categoryDataErr) return;

	const { data: newTransactionFromData, error: newTransactionFromInsertErr } =
		await insertNewTransactionData(
			values.date,
			values.account_from,
			categoryData!.id
		);

	const { data: newTransactionToData, error: newTransactionToInsertErr } =
		await insertNewTransactionData(
			values.date,
			values.account_to,
			categoryData!.id
		);

	if (newTransactionFromInsertErr || newTransactionToInsertErr) return;

	const { error: newExpenseInsertError } = await insertNewTransferData(
		values.account_from,
		values.account_to,
		newTransactionFromData!.id,
		newTransactionToData!.id,
		values.amount
	);
	if (newExpenseInsertError) alert('Please try it again');

	return 'ok';
};
