import CalendarClientPage from '@/components/calendar/Calendar.client.page';
import styles from './calendar.module.scss';
import { MonthTransactionDataContextProvider } from '@/contexts/monthTransactionContext/monthTransactions.provider';
import { getMonthTransactions } from '../api/transactions';
import { DateTime } from 'luxon';
import Footer from '@/components/main/Footer';

const Calendar = async () => {
	const dateInfo = DateTime.now();
	const monthTransactionData = await getMonthTransactions(dateInfo);

	return (
		<MonthTransactionDataContextProvider initialData={monthTransactionData}>
			<div className={styles.calendar}>
				<CalendarClientPage />
				<Footer />
			</div>
		</MonthTransactionDataContextProvider>
	);
};

export default Calendar;
