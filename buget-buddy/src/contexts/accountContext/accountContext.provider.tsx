'use client';

import { AccountDataType } from '@/type';
import { ReactNode, createContext, useContext, useState } from 'react';

type AccountDataContextType = {
	accountData: AccountDataType;
};

const AccountDataContext = createContext<AccountDataType | undefined>(
	undefined
);
AccountDataContext.displayName = 'AccountDataContext';

export const useAccountData = () => {
	const context = useContext(AccountDataContext);
	if (context === undefined) {
		throw new Error(
			'useAccountData must be used within a GlobalContextProvider'
		);
	}
	return context;
};

const SetAccountData = createContext<any | undefined>(undefined);
SetAccountData.displayName = 'setAccountDataContext';

export const useSetAccountData = () => {
	const context = useContext(SetAccountData);
	if (context === undefined) {
		throw new Error(
			'useSetAccountData must be used within a GlobalContextProvider'
		);
	}
	return context;
};

type UserDataContextProviderProps = {
	children: ReactNode;
	initialData: AccountDataContextType;
};

const AccountDataContextProviderComponent = ({
	children,
	initialData,
}: UserDataContextProviderProps) => {
	const [data, setData] = useState<AccountDataType>(initialData.accountData);

	const refresh = async () => {
		const res = await fetch(`/api/getAccountInfo`, { method: 'POST' });
		const accountData = await res.json();
		setData(accountData);
	};

	return (
		<SetAccountData.Provider value={refresh}>
			<AccountDataContext.Provider value={data}>
				{children}
			</AccountDataContext.Provider>
		</SetAccountData.Provider>
	);
};

export const AccountDataContextProvider = AccountDataContextProviderComponent;
