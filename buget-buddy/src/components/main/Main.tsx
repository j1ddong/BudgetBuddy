'use server';

import { createClient } from '@/app/utils/supabase/server';
import Footer from '@/components/main/Footer';
import DayMain from '@/components/main/Day.main';

const Main = async () => {
	const supabase = createClient();

	// const { data: accountData, error: accountErr } = await supabase
	// 	.from('accounts')
	// 	.select()
	// 	.eq('user_id', user_id);

	// if (accountData?.length === 0) {
	// 	redirect(process.env.NEXT_PUBLIC_SITE_URL! + '/set-finance');
	// }

	// 있으면 달력페이지
	return (
		<>
			<DayMain />
			<Footer />
		</>
	);
};

export default Main;
