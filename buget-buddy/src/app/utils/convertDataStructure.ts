import {
	AccountDataType,
	selectDataMapType,
	transactionHistoryType,
} from '@/type';

export const mapAccountData = (accountData: AccountDataType) => {
	const accountDataMap: selectDataMapType = [];
	accountData?.forEach((account) => {
		accountDataMap.push({ label: account.display_name, value: account.id });
	});
	return accountDataMap;
};

export const mapCategoryTransactionDataAndGetTotalAmount = (
	transactionData: any[],
	category: string | null
) => {
	const categoryHistory: transactionHistoryType = [];
	let totalAmount = 0;

	if (category === 'transfer') {
		transactionData?.forEach((transaction) => {
			const transferAmount =
				transaction.from === undefined
					? transaction.to[0].amount
					: -transaction.from[0].amount;

			totalAmount += transferAmount;
			categoryHistory.push({
				id: transaction.id,
				account: transaction.accounts.display_name,
				category: transaction.categories.display_name,
				amount: transferAmount,
			});
		});

		return { categoryHistory, totalAmount };
	}

	transactionData?.forEach((transaction) => {
		totalAmount += transaction.detail[0].amount;
		categoryHistory.push({
			id: transaction.id,
			account: transaction.accounts.display_name,
			category: transaction.categories.display_name,
			amount: transaction.detail[0].amount,
		});
	});

	return { categoryHistory, totalAmount };
};

export const getCurrency = (
	account_id: string | null,
	accountData: AccountDataType
) => {
	const accont = accountData?.find((account) => account.id === account_id);
	return accont?.currencies.display_name;
};
