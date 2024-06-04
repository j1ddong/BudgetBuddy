'use client';

import { exchangeFormSchema, exchangeForm } from '@/app/utils/formValidation';
import { selectDataMapType } from '@/type';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from 'next/navigation';
import tranasactionStyle from '@/app/new-transaction/newTransaction.module.css';
import { DateTime } from 'luxon';
import { exchangeFormDBInsert } from '@/app/utils/db';
import { supabase } from '@/app/utils/supabase/authAdmin';

type ExchangeFormPropsType = {
	accountInfo: selectDataMapType;
	type: string;
};

const ExchangeForm = ({ accountInfo, type }: ExchangeFormPropsType) => {
	const router = useRouter();

	const exchangeForm = useForm<exchangeForm>({
		mode: 'uncontrolled',
		initialValues: {
			date: DateTime.now().toFormat('yyyy-MM-dd'),
			account_from: '',
			account_to: '',
			amount_from: 0,
			amount_to: 0,
		},
		validate: zodResolver(exchangeFormSchema),
	});

	const transferFormSubmit = exchangeForm.onSubmit(async (values) => {
		await exchangeFormDBInsert(supabase, values, type);
		router.push('/');
	});

	return (
		<>
			<form onSubmit={transferFormSubmit}>
				<TextInput
					label='Date'
					type='date'
					key={exchangeForm.key('date')}
					{...exchangeForm.getInputProps('date')}
				/>
				<Select
					label='Account from'
					required
					withAsterisk
					searchable
					data={accountInfo}
					key={exchangeForm.key('account_from')}
					{...exchangeForm.getInputProps('account_from')}
				/>
				<Select
					label='Account to'
					required
					withAsterisk
					searchable
					data={accountInfo}
					key={exchangeForm.key('account_to')}
					{...exchangeForm.getInputProps('account_to')}
				/>
				<NumberInput
					withAsterisk
					required
					label='Amount from'
					allowNegative={false}
					decimalScale={2}
					thousandSeparator=','
					key={exchangeForm.key('amount_from')}
					{...exchangeForm.getInputProps('amount_from')}
				/>
				<NumberInput
					withAsterisk
					required
					label='Amount to'
					allowNegative={false}
					decimalScale={2}
					thousandSeparator=','
					key={exchangeForm.key('amount_to')}
					{...exchangeForm.getInputProps('amount_to')}
				/>
				<Button className={tranasactionStyle.btn} fullWidth type='submit'>
					ADD
				</Button>
			</form>
		</>
	);
};

export default ExchangeForm;
