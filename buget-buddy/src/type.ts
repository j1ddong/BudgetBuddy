type confirmUrlSearchParamsType = { searchParams: { confirmUrl: string } };
type userInfoSearchParamsType = {
	searchParams: { uid: string; error_code: string };
};

type selectDataMapType = { value: string; label: string }[];

type accountInfoType = {
	account_type_id: string;
	balance: number;
	currency_id: string;
	display_name: string;
	id: string;
};

type IdMapType = {
	[id: string]: string;
};

type transactionHistoryType = {
	id: string;
	account: string;
	category: string;
	amount: number;
}[];

type DayAmountBoxPropsType = {
	year: number;
	month: number;
	day: number;
};

type AccountDataType =
	| {
			account_type_id: string;
			balance: number;
			bank_name: string | null;
			created_at: string;
			currency_id: string;
			display_name: string;
			id: string;
			user_id: string;
			currencies: {
				display_name: string;
			};
	  }[]
	| null;

type transactionDataType =
	| {
			tableName: any;
			id: any;
			expense_transactions: {
				amount: any;
			}[];
			categories: {
				display_name: any;
				transaction_type: any;
			}[];
			accounts: {
				display_name: any;
			}[];
	  }[]
	| null;
