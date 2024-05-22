import accountStyles from '@/app/set-finance/account.module.css';

const AccountInfo = ({
	accountInfoData,
	currencyIdMap,
	accountTypeIdMap,
}: {
	accountInfoData: accountInfoType[];
	currencyIdMap: IdMapType;
	accountTypeIdMap: IdMapType;
}) => {
	return (
		<>
			<h3 className={accountStyles.accountText}>Accounts</h3>
			{accountInfoData.map((accountInfo) => {
				return (
					<div key={accountInfo.id} className={accountStyles.accountContainer}>
						<p>{accountInfo.display_name}</p>
						<span>{accountTypeIdMap[accountInfo.account_type_id]}</span>
						<span>
							{accountInfo.balance}
							{currencyIdMap[accountInfo.currency_id]}
						</span>
					</div>
				);
			})}
		</>
	);
};

export default AccountInfo;
