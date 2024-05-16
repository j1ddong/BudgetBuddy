'use server';

import { createClient } from '@/app/utils/supabase/server';
import Main from '@/app/(main)/Main';

const Home = async () => {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();

	return <Main />;
};
export default Home;
