'use client';
import { transferFormDBInsert } from '@/app/utils/db';
import { transferFormSchema, transferForm } from '@/app/utils/formValidation';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import tranasactionStyle from '@/app/new-transaction/newTransaction.module.css';
import { selectDataMapType } from '@/type';
import { supabase } from '@/app/utils/supabase/authAdmin';

type TransferFormPropsType = {
	accountInfo: selectDataMapType;
	type: string;
};

const TransferForm = ({ accountInfo, type }: TransferFormPropsType) => {
	const router = useRouter();

	const transferForm = useForm<transferForm>({
		mode: 'uncontrolled',
		initialValues: {
			date: DateTime.now().toFormat('yyyy-MM-dd'),
			amount: 0,
			account_from: '',
			account_to: '',
		},
		validate: zodResolver(transferFormSchema),
	});

	const transferFormSubmit = transferForm.onSubmit(async (values) => {
		await transferFormDBInsert(supabase, values, type);
		router.push('/');
	});

	return (
		<>
			<form onSubmit={transferFormSubmit}>
				<TextInput
					label='Date'
					type='date'
					key={transferForm.key('date')}
					{...transferForm.getInputProps('date')}
				/>
				<NumberInput
					withAsterisk
					required
					label='Amount'
					allowNegative={false}
					decimalScale={2}
					thousandSeparator=','
					key={transferForm.key('amount')}
					{...transferForm.getInputProps('amount')}
				/>
				<Select
					label='Account from'
					required
					withAsterisk
					searchable
					data={accountInfo}
					key={transferForm.key('account_from')}
					{...transferForm.getInputProps('account_from')}
				/>
				<Select
					label='Account to'
					required
					withAsterisk
					searchable
					data={accountInfo}
					key={transferForm.key('account_to')}
					{...transferForm.getInputProps('account_to')}
				/>
				<Button className={tranasactionStyle.btn} fullWidth type='submit'>
					ADD
				</Button>
			</form>
		</>
	);
};

export default TransferForm;
