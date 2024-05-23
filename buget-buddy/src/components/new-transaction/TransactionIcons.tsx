'use client';

import tranasactionStyle from '@/app/new-transaction/newTransaction.module.css';
import {
	IconToolsKitchen2,
	IconShoppingCart,
	IconBus,
	IconHanger,
	IconGift,
	IconBook,
	IconBarbell,
	IconArmchair2,
	IconSunElectricity,
	IconPhoto,
	IconFriends,
	IconPerfume,
	IconPigMoney,
	IconMoneybag,
	IconTransfer,
	IconCoin,
} from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import { cx } from '@/app/utils/classname.utils';

const iconSize: number = 35;

const TransactionIcons = ({
	transType,
	setTransType,
}: {
	transType: string | null;
	setTransType: Dispatch<SetStateAction<string | null>>;
}) => {
	const transactionIconsMapList: { title: string; icon: JSX.Element }[] = [
		{
			title: 'Food',
			icon: <IconToolsKitchen2 stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Grocery',
			icon: <IconShoppingCart stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Transport',
			icon: <IconBus stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Clothes',
			icon: <IconHanger stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Gift',
			icon: <IconGift stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Education',
			icon: <IconBook stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Health',
			icon: <IconBarbell stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Household',
			icon: <IconArmchair2 stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Dues',
			icon: (
				<IconSunElectricity stroke={2} width={iconSize} height={iconSize} />
			),
		},
		{
			title: 'Culture',
			icon: <IconPhoto stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'SocialLife',
			icon: <IconFriends stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Beauty',
			icon: <IconPerfume stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Allowance',
			icon: <IconPigMoney stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Salary',
			icon: <IconMoneybag stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Transfer',
			icon: <IconTransfer stroke={2} width={iconSize} height={iconSize} />,
		},
		{
			title: 'Exchange',
			icon: <IconCoin stroke={2} width={iconSize} height={iconSize} />,
		},
	];

	return (
		<div className={tranasactionStyle.icon}>
			{transactionIconsMapList.map((iconMap) => {
				return (
					<div key={iconMap.title} onClick={() => setTransType(iconMap.title)}>
						<div
							className={cx(
								tranasactionStyle.container,
								transType === iconMap.title ? tranasactionStyle.active : false
							)}
						>
							{iconMap.icon}
						</div>
						<p>{iconMap.title}</p>
					</div>
				);
			})}
		</div>
	);
};

export default TransactionIcons;
