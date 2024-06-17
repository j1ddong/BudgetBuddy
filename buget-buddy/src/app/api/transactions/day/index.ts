import { supabase } from '@/app/utils/supabase/authAdmin';
import { getDayCategoryTransactionsType } from '@/type';

export const getDayCategoryTransactions: getDayCategoryTransactionsType =
	async ({ date: { year, month, day } }, account_id, category) => {
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
