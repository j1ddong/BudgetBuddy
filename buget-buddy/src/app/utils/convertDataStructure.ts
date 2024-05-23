export const mapAccountData = (accountData: AccountDataType) => {
	const accountDataMap: selectDataMapType = [];
	accountData?.forEach((account) => {
		accountDataMap.push({ label: account.display_name, value: account.id });
	});
	return accountDataMap;
};

export const mapCategoryTransactionDataAndGetTotalAmount = (
	transactionData: any,
	category: string | null
) => {
	const categoryHistory: transactionHistoryType = [];
	let totalAmount = 0;
	transactionData?.forEach((transaction: any) => {
		totalAmount += transaction[`${category}_transactions`][0].amount;
		categoryHistory.push({
			id: transaction.id,
			account: transaction.accounts.display_name,
			category: transaction.categories.display_name,
			amount: transaction[`${category}_transactions`][0].amount,
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
