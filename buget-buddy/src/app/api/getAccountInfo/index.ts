import { supabase } from '@/app/utils/supabase/authAdmin';
import { createClient } from '@/app/utils/supabase/server';

export const getAccountInfo = async () => {
	const authSupabase = createClient();
	const {
		data: { user },
	} = await authSupabase.auth.getUser();

	if (!user) {
		return null;
	}

	const { data: accountData, error: accountDataErr } = await supabase
		.from('accounts')
		.select('*, currencies!inner(display_name)')
		.eq('user_id', user.id);
	return accountData;
};
