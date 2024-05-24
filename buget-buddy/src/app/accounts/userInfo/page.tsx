'use client';
import { userInfoFormSchema } from '@/app/utils/formValidation';
import { createClient } from '@/app/utils/supabase/client';
import { Button, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import authStyles from '@/app/accounts/auth.module.css';
import { navigateToSetFinance } from '@/app/utils/navigate';
import { userInfoSearchParamsType } from '@/type';

const UserInfo = ({ searchParams }: userInfoSearchParamsType) => {
	const form = useForm({
		mode: 'uncontrolled',
		validate: zodResolver(userInfoFormSchema),
	});
	const supabase = createClient();

	const submitUserInfo = form.onSubmit(async (values) => {
		const { error } = await supabase.from('users').insert({
			id: searchParams.uid,
			username: values.username,
			birth_date: values.birth_date,
		});
		if (error) {
			return;
		}
		navigateToSetFinance();
	});
	return (
		<form onSubmit={submitUserInfo}>
			<TextInput
				withAsterisk
				required
				label='Username'
				key={form.key('username')}
				{...form.getInputProps('username')}
			/>
			<TextInput
				withAsterisk
				required
				label='Birth date'
				key={form.key('birth_date')}
				{...form.getInputProps('birth_date')}
				type='date'
			/>
			<Button className={authStyles.authBtn} fullWidth type='submit'>
				Submit
			</Button>
		</form>
	);
};

export default UserInfo;
