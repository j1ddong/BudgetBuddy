import { supabase } from '@/app/utils/supabase/authAdmin';
import { DateTime } from 'luxon';

export const getOtherMonthExchangeRate = async (
	dateInfoString: string,
	currency_from: string,
	currency_to: string
) => {
	const dateInfo = DateTime.fromISO(dateInfoString);
	const startDateInfo = dateInfo.minus({ month: 1 });

	const { data } = await supabase
		.from('exchange_rates')
		.select('rate')
		.eq('currency_from', currency_from)
		.eq('currency_to', currency_to)
		.gte('date', startDateInfo.toISODate())
		.lte('date', dateInfo.toISODate());

	let highestRate: number = 0;
	let lowestRate: number = 1e6;
	let averageRate: number = 0;

	data?.forEach((currencyRate) => {
		if (highestRate < currencyRate.rate) {
			highestRate = currencyRate.rate;
		} else if (lowestRate > currencyRate.rate) {
			lowestRate = currencyRate.rate;
		}
		averageRate += currencyRate.rate;
	});
	averageRate /= data?.length ? data.length : 1;

	return { highestRate, lowestRate, averageRate };
};
