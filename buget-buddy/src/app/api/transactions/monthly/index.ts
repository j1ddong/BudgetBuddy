import { supabase } from '@/app/utils/supabase/authAdmin';
import { createClient } from '@/app/utils/supabase/server';
import { DateTime } from 'luxon';

export const getMonthlyTransactions = async (dateInfoString: string) => {
	const dateInfo = DateTime.fromISO(dateInfoString);
	const endDate = dateInfo.minus({ month: 6 });
	const endYear = endDate.year;
	const endMonth = endDate.month;

	const authSupaabse = createClient();
	const { data: userAccountData } = await authSupaabse
		.from('accounts')
		.select('id');
	const accounts: string[] = [];
	userAccountData?.forEach((account) => {
		accounts.push(account.id);
	});

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

	return {
		monthlyExpenseTransactionData,
		monthlyDepositTransactionData,
	};
};

export const getMonthExchangeTransaction = async (dateInfoString: string) => {
	const dateInfo = DateTime.fromISO(dateInfoString);

	const authSupaabse = createClient();
	const { data: userAccountData } = await authSupaabse
		.from('accounts')
		.select('id, currencies(id, display_name)');

	const accounts: string[] = [];
	const accountCurrencyInfo: {
		[id: string]: { currencyId: string; name: string };
	} = {};
	userAccountData?.forEach((account) => {
		accounts.push(account.id);
		accountCurrencyInfo[account.id] = {
			currencyId: account.currencies!.id,
			name: account.currencies!.display_name,
		};
	});

	const { data: monthExchangeTransactionData } = await supabase
		.from('transactions')
		.select(
			`id, date,
		exchange_transactions!exchange_transactions_transaction_id_to_fkey!inner
		(amount_to, amount_from, account_from, account_to)
		`
		)
		.in('account_id', accounts)
		.gte('date', dateInfo.startOf('month').toISODate())
		.lte('date', dateInfo.endOf('month').toISODate());

	const monthExchangeStatisticDir: {
		[currency: string]: {
			account_from: string;
			account_to: string;
			amount_to: number;
			amount_from: number;
			transactions: {
				[date: string]: { amount_from: number; amount_to: number };
			}[];
		};
	} = {};
	monthExchangeTransactionData?.forEach((transaction) => {
		const { account_from, account_to, amount_from, amount_to } =
			transaction.exchange_transactions[0];
		const account_from_name = accountCurrencyInfo[account_from].name;
		const account_to_name = accountCurrencyInfo[account_to].name;
		const key = `${account_from_name}-${account_to_name}`;

		const transactionDate = transaction.date;

		if (monthExchangeStatisticDir[key]) {
			monthExchangeStatisticDir[key].amount_from += amount_from;
			monthExchangeStatisticDir[key].amount_to += amount_to;
			monthExchangeStatisticDir[key].transactions.push({
				[transactionDate]: { amount_from, amount_to },
			});
		} else {
			monthExchangeStatisticDir[key] = {
				account_from: accountCurrencyInfo[account_from].currencyId,
				account_to: accountCurrencyInfo[account_to].currencyId,
				amount_from,
				amount_to,
				transactions: [{ [transactionDate]: { amount_from, amount_to } }],
			};
		}
	});
	return monthExchangeStatisticDir;
};

export const getMonthExchangeRate = async (
	dateInfoString: string,
	currency_from: string,
	currency_to: string
) => {
	const dateInfo = DateTime.fromISO(dateInfoString);

	const { data } = await supabase
		.from('exchange_rates')
		.select()
		.eq('currency_from', currency_from)
		.eq('currency_to', currency_to)
		.gte('date', dateInfo.startOf('month').toISODate())
		.lte('date', dateInfo.endOf('month').toISODate())
		.order('date', { ascending: true });
	return data;
};
