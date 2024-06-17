import { NextRequest, NextResponse } from 'next/server';
import { transferFormDBInsert } from '.';

export async function POST(req: NextRequest) {
	const params = await req.json();
	const { values, type } = params;

	const result = await transferFormDBInsert(values, type);

	if (result === 'ok') return NextResponse.json('', { status: 200 });
	return NextResponse.json('', { status: 400 });
}
