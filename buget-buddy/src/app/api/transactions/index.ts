import { supabase } from '@/app/utils/supabase/authAdmin';

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

export const getCurrencyId = async (account_id: string) => {
	const { data, error } = await supabase
		.from('accounts')
		.select(`currencies(id)`)
		.eq('id', account_id)
		.single();
	return data!.currencies!.id;
};
