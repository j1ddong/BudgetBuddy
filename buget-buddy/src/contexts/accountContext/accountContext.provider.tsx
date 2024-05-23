'use client';

import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react';

type AccountDataContextType = {
	accountData: AccountDataType;
};

const AccountDataContext = createContext<AccountDataContextType | undefined>(
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

const SetAccountData = createContext<
	Dispatch<SetStateAction<AccountDataContextType>> | undefined
>(undefined);
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
	const [data, setData] = useState(initialData);

	return (
		<SetAccountData.Provider value={setData}>
			<AccountDataContext.Provider value={data}>
				{children}
			</AccountDataContext.Provider>
		</SetAccountData.Provider>
	);
};

export const AccountDataContextProvider = AccountDataContextProviderComponent;
