'use server';

import Footer from '@/components/main/Footer';
import DayMain from '@/components/main/Day.main';

const Main = async () => {
	return (
		<>
			<DayMain />
			<Footer />
		</>
	);
};

export default Main;
