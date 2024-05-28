'use client';

import { Button, PasswordInput, TextInput } from '@mantine/core';
import authStyles from '@/app/accounts/auth.module.css';
import { useForm, zodResolver } from '@mantine/form';
import { authFormSchema } from '@/app/utils/formValidation';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useSetAccountData } from '@/contexts/accountContext/accountContext.provider';

const Signin = () => {
	const form = useForm({
		mode: 'uncontrolled',
		validate: zodResolver(authFormSchema),
	});

	const supabase = createClient();

	const router = useRouter();
	const refresh = useSetAccountData();

	const submitSignIn = form.onSubmit(async (values) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password,
		});
		if (error) {
			alert('Please Check your email or password again');
			return;
		}
		if (data.user) {
			refresh();
			router.push('/');
			return;
		}
		alert('Please try again');
	});

	return (
		<div>
			<form onSubmit={submitSignIn}>
				<TextInput
					withAsterisk
					required
					label='Email'
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<PasswordInput
					withAsterisk
					required
					label='Password'
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<Button
					className={authStyles.authBtn}
					fullWidth
					type='submit'
					variant='filled'
				>
					Sign In
				</Button>
			</form>
		</div>
	);
};

export default Signin;
