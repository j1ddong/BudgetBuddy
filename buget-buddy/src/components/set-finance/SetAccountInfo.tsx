'use client';

import styles from '@/app/page.module.css';
import accountStyles from '@/app/set-finance/account.module.css';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useForm, zodResolver } from '@mantine/form';
import {
	AccountInfoForm,
	accountInfoFormSchema,
} from '@/app/utils/formValidation';
import AccountInfo from './AccountInfo';

const SetAccountInfo = () => {
	const supabase = createClient();

	const form = useForm<AccountInfoForm>({
		mode: 'uncontrolled',
		validate: zodResolver(accountInfoFormSchema),
	});

	const [currencyTypeData, setCurrencyTypeData] = useState<selectDataMapType>(
		[]
	);
	const [accountTypeData, setAccountTypeData] = useState<selectDataMapType>([]);

	const [accountInfoData, setAccountInfoData] = useState<accountInfoType[]>([]);

	const currencyIdMapRef = useRef<IdMapType>({});
	const accountTypeIdMapRef = useRef<IdMapType>({});

	useEffect(() => {
		const getCurrencyTypeInfo = async () => {
			const { data: currencyTypeInfo, error } = await supabase
				.from('currencies')
				.select();

			const currencyTypeMap: selectDataMapType = [];

			currencyTypeInfo!.forEach((currencyType) => {
				currencyTypeMap.push({
					value: currencyType.id,
					label: currencyType.display_name,
				});
				currencyIdMapRef.current[currencyType.id] = currencyType.display_name;
			});
			setCurrencyTypeData(currencyTypeMap);
		};

		const getAccountTypeInfo = async () => {
			const { data: accountTypeInfo, error } = await supabase
				.from('account_types')
				.select();
			const accountTypeMap: selectDataMapType = [];
			accountTypeInfo!.forEach((accountType) => {
				accountTypeMap.push({
					value: accountType.id,
					label: accountType.display_name,
				});
				accountTypeIdMapRef.current[accountType.id] = accountType.display_name;
			});
			setAccountTypeData(accountTypeMap);
		};

		const getAccountInfo = async () => {
			const { data: accountInfo, error: accountInfoErr } = await supabase
				.from('accounts')
				.select('balance, currency_id, display_name, id, account_type_id');
			if (accountInfo) setAccountInfoData(accountInfo);
		};

		getCurrencyTypeInfo();
		getAccountTypeInfo();
		getAccountInfo();
	}, [supabase]);

	const submitAcoountInfo = form.onSubmit(async (values) => {
		const { data: loggedInData, error: loggedInDataErr } =
			await supabase.auth.getUser();

		const user_id = loggedInData.user!.id;

		const { data: accountInfoInsertData, error: accountInfoInsertErr } =
			await supabase
				.from('accounts')
				.insert({
					user_id,
					currency_id: values.currency,
					account_type_id: values.accountType,
					display_name: values.accountName,
					balance: values.balance,
				})
				.select();
		if (accountInfoInsertErr) {
			alert('Please try again');
			return;
		}
		if (accountInfoInsertData) {
			setAccountInfoData((pre) => [
				...pre,
				{
					account_type_id: accountInfoInsertData.account_type_id,
					balance: accountInfoInsertData.balance,
					currency_id: accountInfoInsertData.currency_id,
					display_name: accountInfoInsertData.display_name,
					id: accountInfoInsertData.id,
				},
			]);
		}
		form.reset();
	});

	return (
		<>
			<h3 className={accountStyles.accountText}>New Account</h3>
			<form onSubmit={submitAcoountInfo}>
				<Select
					label='Currency'
					required
					withAsterisk
					searchable
					data={currencyTypeData}
					key={form.key('currency')}
					{...form.getInputProps('currency')}
				/>
				<Select
					label='Account type'
					required
					withAsterisk
					data={accountTypeData}
					key={form.key('accountType')}
					{...form.getInputProps('accountType')}
				/>
				<TextInput
					label='Account name'
					required
					withAsterisk
					key={form.key('accountName')}
					{...form.getInputProps('accountName')}
				/>
				<NumberInput
					label='Set your balance'
					withAsterisk
					required
					min={0}
					allowNegative={false}
					decimalScale={2}
					thousandSeparator=','
					key={form.key('balance')}
					{...form.getInputProps('balance')}
				/>
				<Button className={styles.btn} type='submit' fullWidth>
					Add
				</Button>
			</form>
			<hr />
			<AccountInfo
				accountInfoData={accountInfoData}
				currencyIdMap={currencyIdMapRef.current}
				accountTypeIdMap={accountTypeIdMapRef.current}
			/>
		</>
	);
};

export default SetAccountInfo;
