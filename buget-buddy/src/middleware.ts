import { type NextRequest, NextResponse } from 'next/server';
import { makeMiddlewareSession } from '@/app/utils/supabase/makeMiddlewareSession';

export async function middleware(request: NextRequest) {
	const { response, supabase } = makeMiddlewareSession(request);
	const { pathname: requestPath } = request.nextUrl;

	if (requestPath.startsWith('/accounts')) return response;

	const user = await supabase.auth.getUser().then(({ data }) => data.user);

	const sendToAuth = () => {
		return NextResponse.redirect(new URL('/accounts/signin', request.url));
	};
	if (user) {
		const user_id = user!.id;

		const { data: userInfotData, error: userInfoErr } = await supabase
			.from('users')
			.select()
			.eq('id', user_id);

		if (userInfotData?.length === 0) {
			return NextResponse.redirect(
				new URL(`/accounts/userInfo?uid=${user_id}`, request.url)
			);
		}
	} else {
		return sendToAuth();
	}
	return response;
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:txt|xml|js|css|ico|svg|png|jpg|jpeg|gif|webp|json)$).*)',
	],
};
