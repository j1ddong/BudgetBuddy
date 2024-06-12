import { supabase } from '@/app/utils/supabase/authAdmin';
import { DateTime } from 'luxon';

const BASE_URL = 'https://api.currencybeacon.com/v1';

export const getExchangeRate = async (
	currency_from: string,
	currency_to: string
) => {
	const dateInfo = DateTime.now();
	const year = dateInfo.year;
	const month = dateInfo.month < 10 ? '0' + dateInfo.month : dateInfo.month;
	const day = dateInfo.day - 1;

	const URL =
		BASE_URL +
		`/historical/?base=${currency_from}
    &date=${year}-${month}-${day}
    &symbols=${currency_to}
    &api_key=${process.env.API_KEY!}`;
	const res = await fetch(URL, { method: 'GET' });
	const exchangeRateData = await res.json();

	return exchangeRateData.rates[currency_to];
};

export const getCurrencyName = async (currency: string) => {
	const { data } = await supabase
		.from('currencies')
		.select('display_name')
		.eq('id', currency)
		.single();
	return data!.display_name;
};
