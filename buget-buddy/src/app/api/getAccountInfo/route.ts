import { NextRequest, NextResponse } from 'next/server';
import { getAccountInfo } from '.';

export async function POST(req: NextRequest) {
	return NextResponse.json(await getAccountInfo());
}
