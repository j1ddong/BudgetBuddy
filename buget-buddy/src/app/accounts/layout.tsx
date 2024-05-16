import type { Metadata } from 'next';
import styles from '@/app/page.module.css';

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
			<h2 className={styles.appName}>BudgetBuddy</h2>
			{children}
		</div>
	);
}
