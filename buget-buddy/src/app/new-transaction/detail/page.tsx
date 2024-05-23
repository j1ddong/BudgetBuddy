'use client';

import { useRef } from 'react';
import DepositExpenseForm from '@/components/new-transaction/DepositExpenseForm';
import TransferForm from '@/components/new-transaction/TransferForm';
import { useAccountData } from '@/contexts/accountContext/accountContext.provider';
import { mapAccountData } from '@/app/utils/convertDataStructure';

const NewTransactionDetail = ({
	searchParams,
}: {
	searchParams: { type: string };
}) => {
	const { accountData } = useAccountData();
	const accountInfoRef = useRef<selectDataMapType | null>(null);
	accountInfoRef.current = mapAccountData(accountData);

	if (searchParams.type === 'Transfer') {
		return (
			<TransferForm
				accountInfo={accountInfoRef.current}
				type={searchParams.type}
			/>
		);
	} else if (searchParams.type === 'Exchange') {
		return <>Exchange</>;
	}
	return (
		<DepositExpenseForm
			accountInfo={accountInfoRef.current}
			type={searchParams.type}
		/>
	);
};

export default NewTransactionDetail;
