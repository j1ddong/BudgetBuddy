'use client';
import { AppShell } from '@mantine/core';
import mainStyles from '@/app/page.module.css';
import Link from 'next/link';

const Footer = () => {
	return (
		<>
			<AppShell footer={{ height: 60 }}>
				<AppShell.Footer>
					<div className={mainStyles.footerContianer}>
						<Link href='/'>HOME</Link>
						<Link href='/calendar'>CALENDAR</Link>
						<Link href='/statistics'>STATISTICS</Link>
						<Link href='/setting'>SETTING</Link>
					</div>
				</AppShell.Footer>
			</AppShell>
		</>
	);
};

export default Footer;
