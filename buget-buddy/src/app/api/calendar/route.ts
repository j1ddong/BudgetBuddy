import { NextRequest, NextResponse } from 'next/server';
import { getMonthTransactions } from '../transactions';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const { dateInfo } = params;
	return NextResponse.json(await getMonthTransactions(dateInfo));
}
