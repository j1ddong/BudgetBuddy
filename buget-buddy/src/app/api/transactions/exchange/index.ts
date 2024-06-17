import { supabase } from '@/app/utils/supabase/authAdmin';
import { getCategoryId, getCurrencyId, insertNewTransactionData } from '..';
import { DateTime } from 'luxon';

export const insertExchangeTransaction = async (
	values: {
		date: string;
		account_to: string;
		account_from: string;
		amount_from: number;
		amount_to: number;
		exchanged_at: string;
	},
	type: string
) => {
	const { data: categoryData, error: categoryDataErr } =
		await getCategoryId(type);

	if (categoryDataErr) return categoryDataErr;

	const { data: newTransactionFromData, error: newTransactionFromInsertErr } =
		await insertNewTransactionData(
			values.date,
			values.account_from,
			categoryData!.id
		);
	if (newTransactionFromInsertErr) return newTransactionFromInsertErr;

	const { data: newTransactionToData, error: newTransactionToInsertErr } =
		await insertNewTransactionData(
			values.date,
			values.account_to,
			categoryData!.id
		);

	if (newTransactionToInsertErr) return newTransactionToInsertErr;

	const { error: newExchangeInsertError } = await supabase
		.from('exchange_transactions')
		.insert({
			account_from: values.account_from,
			account_to: values.account_to,
			transaction_id_from: newTransactionFromData!.id,
			transaction_id_to: newTransactionToData!.id,
			amount_from: values.amount_from,
			amount_to: values.amount_to,
			exchanged_at: values.exchanged_at,
		});

	if (newExchangeInsertError) return newExchangeInsertError;

	return 'ok';
};

export const insertExchangeTransactionExist = async (
	account_from: string,
	account_to: string,
	date: string
) => {
	const currency_from = await getCurrencyId(account_from);
	const currency_to = await getCurrencyId(account_to);

	const { data: exchangeRateData } = await supabase
		.from('exchange_rates')
		.select()
		.eq('currency_from', currency_from)
		.eq('currency_to', currency_to)
		.lte('date', date)
		.single();
	if (exchangeRateData) return 'ok';

	const { data: exchangeTransactionExistData } = await supabase
		.from('exchange_transactions_exist')
		.select()
		.eq('currency_from', currency_from)
		.eq('currency_to', currency_to)
		.lte('date', date)
		.single();
	if (exchangeTransactionExistData) return 'ok';

	const { error } = await supabase.from('exchange_transactions_exist').insert({
		currency_from,
		currency_to,
		date,
	});
	if (error) return error;
	return 'ok';
};
