import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { DateTime } from 'luxon';
import {
	depositExpenseFormSchema,
	depositExpenseForm,
} from '@/app/utils/formValidation';
import { depositExpenseFormDBInsert } from '@/app/utils/db';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import tranasactionStyle from '@/app/new-transaction/newTransaction.module.css';
import { selectDataMapType } from '@/type';

type DepositExpenseFormPropsType = {
	accountInfo: selectDataMapType;
	type: string;
};

const DepositExpenseForm = ({
	accountInfo,
	type,
}: DepositExpenseFormPropsType) => {
	const supabase = createClient();
	const router = useRouter();

	const depositExpenseForm = useForm<depositExpenseForm>({
		mode: 'uncontrolled',
		initialValues: {
			date: DateTime.now().toFormat('yyyy-MM-dd'),
			amount: 0,
			account: '',
		},
		validate: zodResolver(depositExpenseFormSchema),
	});

	const depositExpenseFormSubmit = depositExpenseForm.onSubmit(
		async (values) => {
			depositExpenseFormDBInsert(supabase, values, type);
			router.push('/');
		}
	);
	return (
		<>
			<form onSubmit={depositExpenseFormSubmit}>
				<TextInput
					label='Date'
					type='date'
					key={depositExpenseForm.key('date')}
					{...depositExpenseForm.getInputProps('date')}
				/>
				<NumberInput
					withAsterisk
					required
					label='Amount'
					allowNegative={false}
					decimalScale={2}
					thousandSeparator=','
					key={depositExpenseForm.key('amount')}
					{...depositExpenseForm.getInputProps('amount')}
				/>
				<Select
					label='Accounts'
					required
					withAsterisk
					searchable
					data={accountInfo}
					key={depositExpenseForm.key('account')}
					{...depositExpenseForm.getInputProps('account')}
				/>
				<Button className={tranasactionStyle.btn} fullWidth type='submit'>
					ADD
				</Button>
			</form>
		</>
	);
};

export default DepositExpenseForm;
