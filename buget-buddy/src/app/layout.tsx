import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { createClient } from '@/app/utils/supabase/server';
import { UserDataContextProvider } from '@/contexts/userContext/userContext.provider';
import { AccountDataContextProvider } from '@/contexts/accountContext/accountContext.provider';

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

	const { data: accountData, error: accountDataErr } = await supabase
		.from('accounts')
		.select('*, currencies!inner(display_name)')
		.eq('user_id', user!.id);

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
