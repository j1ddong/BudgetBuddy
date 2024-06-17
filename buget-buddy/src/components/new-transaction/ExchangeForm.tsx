'use client';

import { exchangeFormSchema, exchangeForm } from '@/app/utils/formValidation';
import { selectDataMapType } from '@/type';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from 'next/navigation';
import tranasactionStyle from '@/app/new-transaction/newTransaction.module.css';
import { DateTime } from 'luxon';

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
			exchanged_at: '',
		},
		validate: zodResolver(exchangeFormSchema),
	});

	const transferFormSubmit = exchangeForm.onSubmit(async (values) => {
		const { status } = await fetch('/api/transactions/exchange', {
			method: 'POST',
			body: JSON.stringify({ values, type: 'Exchange' }),
		});
		if (status === 200) {
			alert('New transaction has been saved');
			return router.push('/');
		}
		alert('Please try it again');
		return;
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
				<TextInput
					label='Exchanged at'
					key={exchangeForm.key('exchanged_at')}
					{...exchangeForm.getInputProps('exchanged_at')}
				/>
				<Button className={tranasactionStyle.btn} fullWidth type='submit'>
					ADD
				</Button>
			</form>
		</>
	);
};

export default ExchangeForm;
