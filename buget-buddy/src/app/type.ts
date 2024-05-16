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
