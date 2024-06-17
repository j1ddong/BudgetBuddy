import { supabase } from '@/app/utils/supabase/authAdmin';
import { DateTime } from 'luxon';

export const getMonthlyTransactions = async (dateInfoString: string) => {
	const dateInfo = DateTime.fromISO(dateInfoString);
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
