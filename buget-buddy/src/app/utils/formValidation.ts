import { z } from 'zod';

export const authFormSchema = z.object({
	email: z.string().email({ message: 'Invalid email' }),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters',
	}),
});

export type AuthForm = z.infer<typeof authFormSchema>;

export const userInfoFormSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must be at least 3 characters' }),
	birth_date: z
		.string()
		.date()
		.refine((val) => val < new Date().toISOString(), {
			message: 'Please enter the correct birth date',
		}),
});

export type UserInfoForm = z.infer<typeof userInfoFormSchema>;

export const accountInfoFormSchema = z.object({
	currency: z.string(),
	accountType: z.string(),
	accountName: z
		.string()
		.min(3, { message: 'Account name must be at least 3 characters' })
		.max(50, {
			message: 'Account name must be fewer than 9 characters',
		}),
	balance: z.number(),
});

export type AccountInfoForm = z.infer<typeof accountInfoFormSchema>;

export const budgetFormSchema = z.object({
	budget: z.number(),
});

export type budgetForm = z.infer<typeof budgetFormSchema>;

export const depositExpenseFormSchema = z.object({
	date: z.string().date(),
	amount: z.number(),
	account: z.string(),
});
export type depositExpenseForm = z.infer<typeof depositExpenseFormSchema>;

export const transferFormSchema = z.object({
	date: z.string().date(),
	amount: z.number(),
	account_from: z.string(),
	account_to: z.string(),
});
export type transferForm = z.infer<typeof transferFormSchema>;
