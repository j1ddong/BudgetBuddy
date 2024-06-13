import { supabase } from '@/app/utils/supabase/authAdmin';
import { DateTime } from 'luxon';
import { NextResponse } from 'next/server';
import { getCurrencyName, getExchangeRate } from '../cron';

export async function GET() {
	const dateInfo = DateTime.now();

	const { data: exchangeTransactions } = await supabase
		.from('exchange_transactions_exist')
		.select()
		.lte('date', `${dateInfo.year}-${dateInfo.month}-${dateInfo.day - 1}`);
	const currenciesDir: { [currencyId: string]: string } = {};

	exchangeTransactions?.forEach(async (exchangeTransaction) => {
		const { currency_from, currency_to } = exchangeTransaction;
		let currency_from_name;
		let currency_to_name;

		if (currenciesDir[currency_from]) {
			currency_from_name = currenciesDir[currency_from];
		} else {
			currency_from_name = await getCurrencyName(currency_from);
			currenciesDir[currency_from] = currency_from_name;
		}
		if (currenciesDir[currency_to]) {
			currency_to_name = currenciesDir[currency_to];
		} else {
			currency_to_name = await getCurrencyName(currency_to);
			currenciesDir[currency_to] = currency_to_name;
		}

		const rate = await getExchangeRate(currency_from_name, currency_to_name);
		await supabase.from('exchange_rates').insert({
			currency_from,
			currency_to,
			date: exchangeTransaction.date,
			rate,
		});
		await supabase
			.from('exchange_transactions_exist')
			.delete()
			.eq('id', exchangeTransaction.id);
	});
	return NextResponse.json({ exchangeTransactions });
}
