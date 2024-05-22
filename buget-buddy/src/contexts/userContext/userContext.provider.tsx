'use client';

import { User } from '@supabase/supabase-js';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react';

type UserDataContextType = {
	user: User | null;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
	undefined
);
UserDataContext.displayName = 'UserDataContext';

export const useUserData = () => {
	const context = useContext(UserDataContext);
	if (context === undefined) {
		throw new Error('useUserData must be used within a GlobalContextProvider');
	}
	return context;
};

const SetUserData = createContext<
	Dispatch<SetStateAction<UserDataContextType>> | undefined
>(undefined);
SetUserData.displayName = 'setUserDataContext';

export const useSetUserData = () => {
	const context = useContext(SetUserData);
	if (context === undefined) {
		throw new Error(
			'useSetUserData must be used within a GlobalContextProvider'
		);
	}
	return context;
};

type UserDataContextProviderProps = {
	children: ReactNode;
	initialData: UserDataContextType;
};

const UserDataContextProviderComponent = ({
	children,
	initialData,
}: UserDataContextProviderProps) => {
	const [data, setData] = useState(initialData);

	return (
		<SetUserData.Provider value={setData}>
			<UserDataContext.Provider value={data}>
				{children}
			</UserDataContext.Provider>
		</SetUserData.Provider>
	);
};

export const UserDataContextProvider = UserDataContextProviderComponent;
