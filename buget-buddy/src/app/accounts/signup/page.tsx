'use client';

import { authFormSchema } from '@/app/utils/formValidation';
import { createClient } from '@/app/utils/supabase/client';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import authStyles from '@/app/accounts/auth.module.css';

const Signup = () => {
	const form = useForm({
		mode: 'uncontrolled',
		validate: zodResolver(authFormSchema),
	});

	const supabase = createClient();

	const submitSignUp = form.onSubmit(async (values) => {
		const { data, error } = await supabase.auth.signUp({
			email: values.email,
			password: values.password,
			options: {
				emailRedirectTo:
					process.env.NEXT_PUBLIC_SITE_URL + '/accounts/userInfo',
			},
		});

		// error handling
		if (error) {
		}
		if (data.user) {
			alert('Please check the email to active an account');
			form.reset();
		}
	});

	return (
		<div>
			<form onSubmit={submitSignUp}>
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
					Sign up
				</Button>
			</form>
		</div>
	);
};

export default Signup;
