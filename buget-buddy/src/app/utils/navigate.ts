'use server';

import { redirect } from 'next/navigation';

export const navigateToMain = () => {
	redirect(process.env.NEXT_PUBLIC_SITE_URL!);
};

export const navigateToSetFinance = () => {
	redirect(process.env.NEXT_PUBLIC_SITE_URL! + '/set-finance');
};
