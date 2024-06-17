'use client';

import { DateTransactionDirType } from '@/type';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react';

type MonthTransactionDataContextType = DateTransactionDirType;

const MonthTransactionDataContext = createContext<
	MonthTransactionDataContextType | undefined
>(undefined);
MonthTransactionDataContext.displayName = 'MonthTransactionDataContext';

export const useMonthTransactionData = () => {
	const context = useContext(MonthTransactionDataContext);
	if (context === undefined) {
		throw new Error(
			'useMonthTransactionData must be used within a GlobalContextProvider'
		);
	}
	return context;
};

const SetMonthTransactionData = createContext<
	Dispatch<SetStateAction<MonthTransactionDataContextType>> | undefined
>(undefined);

SetMonthTransactionData.displayName = 'setMonthTransactionDataContext';

export const useSetMonthTransactionData = () => {
	const context = useContext(SetMonthTransactionData);
	if (context === undefined) {
		throw new Error(
			'useSetMonthTransactionData must be used within a GlobalContextProvider'
		);
	}
	return context;
};

type MonthTransactionDataContextProviderProps = {
	children: ReactNode;
	initialData: DateTransactionDirType;
};

const MonthTransactionDataContextProviderComponent = ({
	children,
	initialData,
}: MonthTransactionDataContextProviderProps) => {
	const [data, setData] = useState(initialData);

	return (
		<SetMonthTransactionData.Provider value={setData}>
			<MonthTransactionDataContext.Provider value={data}>
				{children}
			</MonthTransactionDataContext.Provider>
		</SetMonthTransactionData.Provider>
	);
};

export const MonthTransactionDataContextProvider =
	MonthTransactionDataContextProviderComponent;
