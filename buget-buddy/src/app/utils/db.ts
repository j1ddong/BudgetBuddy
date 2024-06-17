import 'server-only';
import { supabase } from './supabase/authAdmin';

export const getCategoryId = async (type: string) => {
	const { data, error } = await supabase
		.from('categories')
		.select()
		.eq('display_name', type)
		.single();
	return { data, error };
};

export const insertNewTransactionData = async (
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
