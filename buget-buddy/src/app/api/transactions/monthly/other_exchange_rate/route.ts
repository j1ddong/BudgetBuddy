import { NextRequest, NextResponse } from 'next/server';
import { getOtherMonthExchangeRate } from '.';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const { dateInfo, currency_from, currency_to } = params;
	const result = await getOtherMonthExchangeRate(
		dateInfo,
		currency_from,
		currency_to
	);
	return NextResponse.json(result);
}
