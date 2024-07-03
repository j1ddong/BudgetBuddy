import { NextRequest, NextResponse } from 'next/server';
import { getMonthExchangeTransaction } from '..';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const { dateInfo } = params;
	const result = await getMonthExchangeTransaction(dateInfo);
	return NextResponse.json(result);
}
