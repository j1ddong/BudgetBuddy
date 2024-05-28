import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { UserDataContextProvider } from '@/contexts/userContext/userContext.provider';
import { AccountDataContextProvider } from '@/contexts/accountContext/accountContext.provider';
import { createClient } from './utils/supabase/server';
import { getAccountInfo } from './api/getAccountInfo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'BudgetBuddy',
	description: 'Manage your money with BudgetBuddy',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const accountData = await getAccountInfo();
	return (
		<html lang='en'>
			<head>
				<ColorSchemeScript />
			</head>
			<body className={inter.className}>
				<MantineProvider>
					<UserDataContextProvider initialData={{ user }}>
						<AccountDataContextProvider initialData={{ accountData }}>
							{children}
						</AccountDataContextProvider>
					</UserDataContextProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
