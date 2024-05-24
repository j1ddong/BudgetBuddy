import Link from 'next/link';
import { Button } from '@mantine/core';
import authStyles from '@/app/accounts/auth.module.css';
import { confirmUrlSearchParamsType } from '@/type';

const ConfirmEmail = ({ searchParams }: confirmUrlSearchParamsType) => {
	return (
		<>
			<p className={authStyles.authInfo}>
				<b>Please activate your account!</b>
			</p>
			<Button
				className={authStyles.confirmationBtn}
				fullWidth
				component={Link}
				href={searchParams.confirmUrl}
			>
				Confirm the email
			</Button>
		</>
	);
};

export default ConfirmEmail;
