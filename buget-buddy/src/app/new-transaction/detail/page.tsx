'use client';

import { useRef } from 'react';
import DepositExpenseForm from '@/components/new-transaction/DepositExpenseForm';
import TransferForm from '@/components/new-transaction/TransferForm';
import { useAccountData } from '@/contexts/accountContext/accountContext.provider';
import { mapAccountData } from '@/app/utils/convertDataStructure';
import { selectDataMapType } from '@/type';

const NewTransactionDetail = ({
	searchParams,
}: {
	searchParams: { type: string };
}) => {
	const accountData = useAccountData();
	const accountInfo = mapAccountData(accountData);

	if (searchParams.type === 'Transfer') {
		return <TransferForm accountInfo={accountInfo} type={searchParams.type} />;
	} else if (searchParams.type === 'Exchange') {
		return <>Exchange</>;
	}
	return (
		<DepositExpenseForm accountInfo={accountInfo} type={searchParams.type} />
	);
};

export default NewTransactionDetail;
