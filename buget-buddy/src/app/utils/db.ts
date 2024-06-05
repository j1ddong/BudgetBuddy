import { fetchDayCategoryTransactionsType } from '@/type';
import { SupabaseClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';

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
	category_id: string
) => {
	const { data, error } = await supabase
		.from('transactions')
		.insert({
			date,
			account_id,
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
			categoryData.id
		);

	const { data: newTransactionToData, error: newTransactionToInsertErr } =
		await insertNewTransactionData(
			supabase,
			values.date,
			values.account_to,
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
		// exchange
		if (category === 'exchange') {
			const { data: exchangeFromData, error: exchangeFromDataErr } =
				await supabase
					.from('transactions')
					.select(
						`id,
						from: exchange_transactions!exchange_transactions_transaction_id_from_fkey!inner(amount_from),
						categories(display_name, transaction_type),
						accounts(display_name)`
					)
					.eq('date', `${year}-${month}-${day}`)
					.eq('account_id', account_id);
			const { data: exchangeToData, error: exchangeToDataErr } = await supabase
				.from('transactions')
				.select(
					`id,
					to: exchange_transactions!exchange_transactions_transaction_id_to_fkey!inner(amount_to),
					categories(display_name, transaction_type),
					accounts(display_name)`
				)
				.eq('date', `${year}-${month}-${day}`)
				.eq('account_id', account_id);

			if (exchangeFromDataErr || exchangeToDataErr) return;
			return { data: [...exchangeFromData, ...exchangeToData] };
		}

		// deposit, Expense
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

export const fetchMonthlyTransactions = async (
	supabase: SupabaseClient,
	dateInfo: DateTime
) => {
	const endDate = dateInfo.minus({ month: 6 });
	const endYear = endDate.year;
	const endMonth = endDate.month;

	const { data: monthlyExpenseTransactionData } = await supabase
		.from('transactions')
		.select(
			`date, id,
		categories(display_name, transaction_type),
		amount: expense_transactions!inner(amount)`
		)
		.gte('date', `${endYear}-${endMonth}-01`)
		.lte('date', `${dateInfo.year}-${dateInfo.month}-${dateInfo.daysInMonth}`);

	const { data: monthlyDepositTransactionData } = await supabase
		.from('transactions')
		.select(
			`date, id, 
		categories(display_name, transaction_type), 
		amount: deposit_transactions!inner(amount)`
		)
		.gte('date', `${endYear}-${endMonth}-01`)
		.lte('date', `${dateInfo.year}-${dateInfo.month}-${dateInfo.daysInMonth}`);
	// cad > 다른 통화로 환전된 것만 가져오기
	const { data: monthlyExchangeTransactionData } = await supabase
		.from('transactions')
		.select(
			`date, id,
		categories(display_name, transaction_type),
		amount: exchange_transactions!exchange_transactions_transaction_id_to_fkey!inner(amount_to)
		`
		)
		.gte('date', `${endYear}-${endMonth}-01`)
		.lte('date', `${dateInfo.year}-${dateInfo.month}-${dateInfo.daysInMonth}`);

	return {
		monthlyExpenseTransactionData,
		monthlyDepositTransactionData,
		monthlyExchangeTransactionData,
	};
};

export const insertNewExchangeData = async (
	supabase: SupabaseClient,
	account_from: string,
	account_to: string,
	transaction_id_from: string,
	transaction_id_to: string,
	amount_from: number,
	amount_to: number
) => {
	const { error } = await supabase.from('exchange_transactions').insert({
		account_from,
		account_to,
		transaction_id_from,
		transaction_id_to,
		amount_from,
		amount_to,
	});
	return { error };
};

export const exchangeFormDBInsert = async (
	supabase: SupabaseClient,
	values: {
		date: string;
		account_to: string;
		account_from: string;
		amount_from: number;
		amount_to: number;
	},
	type: string
) => {
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
			categoryData.id
		);

	const { data: newTransactionToData, error: newTransactionToInsertErr } =
		await insertNewTransactionData(
			supabase,
			values.date,
			values.account_to,
			categoryData.id
		);

	if (newTransactionFromInsertErr || newTransactionToInsertErr) {
		alert('Please try it again');
		return;
	}
	const { error: newExchangeInsertError } = await insertNewExchangeData(
		supabase,
		values.account_from,
		values.account_to,
		newTransactionFromData.id,
		newTransactionToData.id,
		values.amount_from,
		values.amount_to
	);
	if (newExchangeInsertError) {
		alert('Please try it again');
		return;
	}

	alert('New transaction has been saved');
};
