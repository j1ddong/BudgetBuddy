import { NextRequest, NextResponse } from 'next/server';
import { getMonthlyTransactions } from '.';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const { dateInfo } = params;

	const result = await getMonthlyTransactions(dateInfo);
	return NextResponse.json(result);
}
