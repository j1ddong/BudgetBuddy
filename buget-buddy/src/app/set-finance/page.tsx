'use client';

import styles from '@/app/page.module.css';
import accountStyles from '@/app/set-finance/account.module.css';
import { Button, NumberInput } from '@mantine/core';
import { createClient } from '../utils/supabase/client';
import SetAccountInfo from '@/components/set-finance/SetAccountInfo';
import { useForm, zodResolver } from '@mantine/form';
import { budgetForm, budgetFormSchema } from '../utils/formValidation';
import Link from 'next/link';

const SetFinance = () => {
	const supabase = createClient();

	const form = useForm<budgetForm>({
		mode: 'uncontrolled',
		validate: zodResolver(budgetFormSchema),
	});

	const submitBudget = form.onSubmit(async (values) => {
		const { data: loggedInData, error: loggedInDataErr } =
			await supabase.auth.getUser();

		const user_id = loggedInData.user!.id;

		const { error: budgetUpdateErr } = await supabase
			.from('users')
			.update({ budget: values.budget })
			.eq('id', user_id);

		if (budgetUpdateErr) {
			alert('Please try it again');
			return;
		}
		form.reset();
		alert('Your budget has been set');
	});

	return (
		<div>
			<Link href='/'>
				<h2 className={styles.appName}>BudgetBuddy</h2>
			</Link>
			<form className={accountStyles.form} onSubmit={submitBudget}>
				<NumberInput
					label='Set your budget'
					min={0}
					allowNegative={false}
					decimalScale={2}
					thousandSeparator=','
					key={form.key('budget')}
					{...form.getInputProps('budget')}
				/>
				<Button type='submit' fullWidth>
					Set
				</Button>
			</form>
			<hr />
			<SetAccountInfo />
		</div>
	);
};

export default SetFinance;
