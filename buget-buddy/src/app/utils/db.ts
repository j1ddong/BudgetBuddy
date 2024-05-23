import { SupabaseClient } from '@supabase/supabase-js';

export const getCategoryId = async (supabase: SupabaseClient, type: string) => {
	const { data, error } = await supabase
		.from('categories')
		.select()
		.eq('display_name', type);
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
		.select();
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
	account_to: string,
	account_from: string,
	transaction_id: string,
	amount: number
) => {
	const { error } = await supabase.from('transfer_transactions').insert({
		account_from,
		account_to,
		transaction_id,
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
			categoryData![0].id
		);

	if (newTransactionInsertErr) {
		alert('Please try it again');
		return;
	}

	if (categoryData![0].transaction_type === 'expense') {
		const { error: newExpenseInsertError } = await insertNewExpenseData(
			supabase,
			values.account,
			newTransactionData![0].id,
			values.amount
		);
		if (newExpenseInsertError) {
			alert('Please try it again');
			return;
		}
	} else {
		const { error: newExpenseInsertError } = await insertNewDepositData(
			supabase,
			values.account,
			newTransactionData![0].id,
			values.amount
		);
		if (newExpenseInsertError) {
			alert('Please try it again');
			return;
		}
	}
	alert('새로운 거래 기록 성공');
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

	const { data: newTransactionData, error: newTransactionInsertErr } =
		await insertNewTransactionData(
			supabase,
			values.date,
			values.account_from,
			user_id,
			categoryData![0].id
		);

	if (newTransactionInsertErr) {
		alert('Please try it again');
		return;
	}
	const { error: newExpenseInsertError } = await insertNewTransferData(
		supabase,
		values.account_from,
		values.account_to,
		newTransactionData![0].id,
		values.amount
	);
	if (newExpenseInsertError) {
		alert('Please try it again3');
		return;
	}

	alert('새로운 거래 기록 성공');
};

export const fetchDayCategoryTransactions = async (
	supabase: SupabaseClient,
	{
		date: { year, month, day },
	}: { date: { year: number; month: number; day: number } },
	account_id: string | null,
	category: string | null
) => {
	const { data, error } = await supabase
		.from('transactions')
		.select(
			`id, ${category}_transactions!inner(amount), 
			categories(display_name, transaction_type), 
			accounts(display_name)`
		)
		.eq('date', `${year}-${month}-${day}`)
		.eq('account_id', account_id);
	return { data, error };
};
