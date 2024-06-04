import type { Metadata } from 'next';
import accountStyles from '@/app/accounts/auth.module.css';

export const metadata: Metadata = {
	title: 'BudgetBuddy',
	description: 'Manage your money with BudgetBuddy',
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<h2 className={accountStyles.appName}>BudgetBuddy</h2>
			{children}
		</div>
	);
}
