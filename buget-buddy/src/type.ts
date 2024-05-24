import { SupabaseClient } from '@supabase/supabase-js';

export type confirmUrlSearchParamsType = {
	searchParams: { confirmUrl: string };
};
export type userInfoSearchParamsType = {
	searchParams: { uid: string; error_code: string };
};

export type selectDataMapType = { value: string; label: string }[];

export type accountInfoType = {
	account_type_id: string;
	balance: number;
	currency_id: string;
	display_name: string;
	id: string;
};

export type IdMapType = {
	[id: string]: string;
};

export type transactionHistoryType = {
	id: string;
	account: string;
	category: string;
	amount: number;
}[];

export type DayDetailBoxPropsType = {
	year: number;
	month: number;
	day: number;
};

export type AccountDataType =
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

export type transactionDataType =
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

export type fetchDayCategoryTransactionsType = (
	supabase: SupabaseClient,
	{
		date: { year, month, day },
	}: { date: { year: number; month: number; day: number } },
	account_id: string | null,
	category: string | null
) => any;