import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AccountDataContextProvider } from '@/contexts/accountContext/accountContext.provider';
import { createClient } from '@/app/utils/supabase/server';
import { UserDataContextProvider } from '@/contexts/userContext/userContext.provider';

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

	return (
		<html lang='en'>
			<head>
				<ColorSchemeScript />
			</head>
			<body className={inter.className}>
				<MantineProvider>
					<UserDataContextProvider initialData={{ user }}>
						{children}
					</UserDataContextProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
