import { NextRequest, NextResponse } from 'next/server';
import { getDayCategoryTransactions } from '.';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const {
		date: { year, month, day },
		account,
		category,
	} = params;

	const result = await getDayCategoryTransactions(
		{ date: { year, month, day } },
		account,
		category
	);

	return NextResponse.json(result);
}
