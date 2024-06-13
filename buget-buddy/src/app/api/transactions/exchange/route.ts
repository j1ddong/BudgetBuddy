import { NextRequest, NextResponse } from 'next/server';
import { insertExchangeTransaction, insertExchangeTransactionExist } from '.';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const { values, type } = params;
	const insertTransactionResult = await insertExchangeTransaction(values, type);
	const exchangeExistResult = await insertExchangeTransactionExist(
		values.account_from,
		values.account_to,
		values.date
	);
	if (exchangeExistResult !== 'ok')
		return NextResponse.json('', { status: 400 });
	if (insertTransactionResult === 'ok')
		return NextResponse.json('', { status: 200 });
	return NextResponse.json('', { status: 400 });
}
