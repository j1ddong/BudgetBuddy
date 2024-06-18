import { supabase } from '@/app/utils/supabase/authAdmin';
import { createClient } from '@/app/utils/supabase/server';
import { DateTransactionDirType, TotalAmountDirType } from '@/type';
import { DateTime } from 'luxon';

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

export const getMonthTransactions = async (dateInfo: DateTime) => {
	const authSupaabse = createClient();
	const { data: userAccountData } = await authSupaabse
		.from('accounts')
		.select('id');
	const accounts: string[] = [];
	userAccountData?.forEach((account) => {
		accounts.push(account.id);
	});

	const currYear = dateInfo.year;
	const currMonth = dateInfo.month;

	let { data: monthExpenseTransactionData } = await supabase
		.from('transactions')
		.select(
			`date, id,
		categories(transaction_type, display_name),
		amount: expense_transactions!inner(amount)`
		)
		.in('account_id', accounts)
		.gte('date', `${currYear}-${currMonth}-01`)
		.lte('date', `${currYear}-${currMonth}-${dateInfo.daysInMonth}`);

	let { data: monthDepositTransactionData } = await supabase
		.from('transactions')
		.select(
			`date, id, 
			categories(transaction_type, display_name), 
			amount: deposit_transactions!inner(amount)`
		)
		.in('account_id', accounts)
		.gte('date', `${currYear}-${currMonth}-01`)
		.lte('date', `${currYear}-${currMonth}-${dateInfo.daysInMonth}`);

	let { data: monthExchangeTransactionData } = await supabase
		.from('transactions')
		.select(
			`date, id,
		categories(transaction_type, display_name),
		amount: exchange_transactions!exchange_transactions_transaction_id_to_fkey!inner(amount_to)
		`
		)
		.in('account_id', accounts)
		.gte('date', `${currYear}-${currMonth}-01`)
		.lte('date', `${currYear}-${currMonth}-${dateInfo.daysInMonth}`);

	const totalAmountDir: TotalAmountDirType = {
		totalDeposit: 0,
		totalExpense: 0,
	};

	const dateTransactionDir: DateTransactionDirType = {};

	const convertDateTransationDir = (transactions: any) => {
		transactions?.forEach((data: any) => {
			if (dateTransactionDir[data.date]) {
				if (data.categories!.transaction_type === 'exchange') {
					dateTransactionDir[data.date].detail.push({
						amount: data.amount[0].amount_to,
						category: data.categories!.display_name!,
						transaction_type: data.categories?.transaction_type!,
					});
					return;
				}
				if (data.categories!.transaction_type === 'expense') {
					totalAmountDir.totalExpense += data.amount[0].amount;
					dateTransactionDir[data.date].dayExpense += data.amount[0].amount;
				} else if (data.categories!.transaction_type === 'deposit') {
					totalAmountDir.totalDeposit += data.amount[0].amount;
					dateTransactionDir[data.date].dayDeposit += data.amount[0].amount;
				}
				dateTransactionDir[data.date].detail.push({
					amount: data.amount[0].amount,
					category: data.categories!.display_name!,
					transaction_type: data.categories?.transaction_type!,
				});
			} else {
				if (data.categories!.transaction_type === 'exchange') {
					dateTransactionDir[data.date] = {
						dayExpense: 0,
						dayDeposit: 0,
						detail: [
							{
								amount: data.amount[0].amount_to,
								category: data.categories!.display_name,
								transaction_type: data.categories!.transaction_type,
							},
						],
					};
					return;
				}
				if (data.categories!.transaction_type === 'expense') {
					totalAmountDir.totalExpense += data.amount[0].amount;
					dateTransactionDir[data.date] = {
						dayExpense: data.amount[0].amount,
						dayDeposit: 0,
						detail: [
							{
								amount: data.amount[0].amount,
								category: data.categories!.display_name,
								transaction_type: data.categories!.transaction_type,
							},
						],
					};
				} else if (data.categories!.transaction_type === 'deposit') {
					totalAmountDir.totalDeposit += data.amount[0].amount;
					dateTransactionDir[data.date] = {
						dayExpense: 0,
						dayDeposit: data.amount[0].amount,
						detail: [
							{
								amount: data.amount[0].amount,
								category: data.categories!.display_name,
								transaction_type: data.categories!.transaction_type,
							},
						],
					};
				}
			}
		});
	};
	convertDateTransationDir(monthExpenseTransactionData);
	convertDateTransationDir(monthDepositTransactionData);
	convertDateTransationDir(monthExchangeTransactionData);

	return { dateTransactionDir, totalAmountDir };
};
