export const cx = (...args: (string | boolean | number)[]): string => {
	return args.filter(Boolean).join(' ');
};
