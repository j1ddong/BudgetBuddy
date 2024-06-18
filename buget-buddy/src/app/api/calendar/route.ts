import { NextRequest, NextResponse } from 'next/server';
import { getMonthTransactions } from '../transactions';
import { DateTime } from 'luxon';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const { dateInfoString } = params;
	const dateInfo = DateTime.fromISO(dateInfoString);
	return NextResponse.json(await getMonthTransactions(dateInfo));
}
