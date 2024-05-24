import { fetchDayCategoryTransactionsType } from '@/type';
import { SupabaseClient } from '@supabase/supabase-js';

export const getCategoryId = async (supabase: SupabaseClient, type: string) => {
	const { data, error } = await supabase
		.from('categories')
		.select()
		.eq('display_name', type)
		.single();
	return { data, error };
};

export const insertNewTransactionData = async (
	supabase: SupabaseClient,
	date: string,
	account_id: string,
	user_id: string,
	category_id: string
) => {
	const { data, error } = await supabase
		.from('transactions')
		.insert({
			date,
			account_id,
			user_id,
			category_id,
		})
		.select()
		.single();
	return { data, error };
};

export const insertNewExpenseData = async (
	supabase: SupabaseClient,
	account_from: string,
	transaction_id: string,
	amount: number
) => {
	const { error } = await supabase.from('expense_transactions').insert({
		account_from,
		transaction_id,
		amount,
	});
	return { error };
};

export const insertNewDepositData = async (
	supabase: SupabaseClient,
	account_to: string,
	transaction_id: string,
	amount: number
) => {
	const { error } = await supabase.from('deposit_transactions').insert({
		account_to,
		transaction_id,
		amount,
	});
	return { error };
};

export const insertNewTransferData = async (
	supabase: SupabaseClient,
	account_from: string,
	account_to: string,
	transaction_id_from: string,
	transaction_id_to: string,
	amount: number
) => {
	const { error } = await supabase.from('transfer_transactions').insert({
		account_from,
		account_to,
		transaction_id_from,
		transaction_id_to,
		amount,
	});
	return { error };
};

export const depositExpenseFormDBInsert = async (
	supabase: SupabaseClient,
	values: {
		account: string;
		amount: number;
		date: string;
	},
	type: string
) => {
	const user_id = await supabase.auth
		.getUser()
		.then(({ data }) => data.user!.id);
	const { data: categoryData, error: categoryDataErr } = await getCategoryId(
		supabase,
		type
	);

	if (categoryDataErr) {
		alert('Please try it again');
		return;
	}

	const { data: newTransactionData, error: newTransactionInsertErr } =
		await insertNewTransactionData(
			supabase,
			values.date,
			values.account,
			user_id,
			categoryData.id
		);

	if (newTransactionInsertErr) {
		alert('Please try it again');
		return;
	}

	if (categoryData.transaction_type === 'expense') {
		const { error: newExpenseInsertError } = await insertNewExpenseData(
			supabase,
			values.account,
			newTransactionData.id,
			values.amount
		);
		if (newExpenseInsertError) {
			alert('Please try it again');
			return;
		}
	} else {
		const { error: newDepositInsertError } = await insertNewDepositData(
			supabase,
			values.account,
			newTransactionData.id,
			values.amount
		);
		if (newDepositInsertError) {
			alert('Please try it again');
			return;
		}
	}
	alert('New transaction has been saved');
};

export const transferFormDBInsert = async (
	supabase: SupabaseClient,
	values: {
		date: string;
		amount: number;
		account_to: string;
		account_from: string;
	},
	type: string
) => {
	const user_id = await supabase.auth
		.getUser()
		.then(({ data }) => data.user!.id);

	const { data: categoryData, error: categoryDataErr } = await getCategoryId(
		supabase,
		type
	);

	if (categoryDataErr) {
		alert('Please try it again');
		return;
	}

	const { data: newTransactionFromData, error: newTransactionFromInsertErr } =
		await insertNewTransactionData(
			supabase,
			values.date,
			values.account_from,
			user_id,
			categoryData.id
		);

	const { data: newTransactionToData, error: newTransactionToInsertErr } =
		await insertNewTransactionData(
			supabase,
			values.date,
			values.account_to,
			user_id,
			categoryData.id
		);

	if (newTransactionFromInsertErr || newTransactionToInsertErr) {
		alert('Please try it again');
		return;
	}
	const { error: newExpenseInsertError } = await insertNewTransferData(
		supabase,
		values.account_from,
		values.account_to,
		newTransactionFromData.id,
		newTransactionToData.id,
		values.amount
	);
	if (newExpenseInsertError) {
		alert('Please try it again');
		return;
	}

	alert('New transaction has been saved');
};

export const fetchDayCategoryTransactions: fetchDayCategoryTransactionsType =
	async (supabase, { date: { year, month, day } }, account_id, category) => {
		// transfer
		if (category === 'transfer') {
			const { data: transferFromData, error: transferFromDataErr } =
				await supabase
					.from('transactions')
					.select(
						`id,
						from: transfer_transactions!transfer_transactions_transaction_id_from_fkey!inner(amount),
						categories(display_name, transaction_type),
						accounts(display_name)`
					)
					.eq('date', `${year}-${month}-${day}`)
					.eq('account_id', account_id);
			const { data: transferToData, error: transferToDataErr } = await supabase
				.from('transactions')
				.select(
					`id,
					to: transfer_transactions!transfer_transactions_transaction_id_to_fkey!inner(amount),
					categories(display_name, transaction_type),
					accounts(display_name)`
				)
				.eq('date', `${year}-${month}-${day}`)
				.eq('account_id', account_id);

			if (transferFromDataErr || transferToDataErr) return;
			return { data: [...transferFromData, ...transferToData] };
		}

		// depoist, Expense
		const { data, error } = await supabase
			.from('transactions')
			.select(
				`id, 
			detail: ${category}_transactions!inner(amount),
			categories(display_name, transaction_type),
			accounts(display_name)`
			)
			.eq('date', `${year}-${month}-${day}`)
			.eq('account_id', account_id);
		return { data };
	};