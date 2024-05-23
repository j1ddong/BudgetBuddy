'use client';

import { Button } from '@mantine/core';
import TransactionIcons from '@/components/new-transaction/TransactionIcons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import tranasactionStyle from '@/app/new-transaction/newTransaction.module.css';

const NewTransaction = () => {
	const [transType, setTransType] = useState<string | null>(null);
	const router = useRouter();

	const handleTransactionBtn = () => {
		if (!transType) return;

		router.push(`/new-transaction/detail?type=${transType}`);
	};

	return (
		<>
			<h4>New transaction</h4>
			<div>
				<TransactionIcons transType={transType} setTransType={setTransType} />
				<Button
					fullWidth
					onClick={handleTransactionBtn}
					className={tranasactionStyle.btn}
				>
					ADD
				</Button>
			</div>
		</>
	);
};

export default NewTransaction;
