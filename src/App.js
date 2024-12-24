import './App.css';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Pie, Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import chroma from 'chroma-js';
import { FaBars } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await axios.get('http://localhost:8080/account/1/summary');
				setData(result.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		const interval = setInterval(fetchData, 300000); // 5 minutes

		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
		<NavBar />
		<div class="body-panels">
			<div class="bp" />
			<div>
				<NetWorthSummary summary={data['total_by_type']} />
				<AccountHistogram monthly={data['snapshot_history_monthly']} yearly={data['snapshot_history_yearly']} networth={data['snapshot_history_networth']} />
				<AccountTable accounts={data.account_balance_with_mom_change} />
			</div>
			<div class="bp" />
		</div>
		</div>
	);
}

function NavBar() {
	const { t, i18n } = useTranslation();
	const name = "John Doe";
	const [menuOpen, setMenuOpen] = useState(false);

	const on_switch = () => {
		i18n.changeLanguage(i18n.language === 'en' ? 'br' : 'en');
	}

	const flagemojiToPNG = (flag) => {
		return (<img src={`https://flagcdn.com/24x18/${flag}.png`} alt='flag' />)
	}

	const getFlagEmoji = (lang) => {
		switch (lang) {
			case 'en':
				return 'br';
			case 'br':
				return 'us';
			default:
				return 'us';
		}
	};

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<nav className="navbar">
			<div className="navbar-brand">
					<div className="navbar-burger" onClick={toggleMenu}>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
					</div>
					<a className="navbar-item" href="/">
						{t('navbar_welcome')} {name}!
					</a>
			</div>
			<div className={`navbar-menu ${menuOpen ? 'is-active' : ''}`}>
					<div className="navbar-start">
						<a href="/" className="navbar-item">{t('summary')}</a>
						<a href="/manage-budgets" className="navbar-item">{t('manage_budgets')}</a>
						<div className="navbar-item-small" onClick={on_switch}>
							{flagemojiToPNG(getFlagEmoji(i18n.language))}
							<span>{t('navbar_switch_language')}</span>
						</div>
						<a href="/logout" className="navbar-item">{t('logout')}</a>
					</div>
			</div>
		</nav>
	)
}

function GetRandomColors(num) {
	const colors = {
		backgroundColors: [],
		lightColors: [],
		complementaryColors: []
	};

	const scale = chroma.scale(['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']).mode('lch').colors(num);

	scale.forEach(color => {
			const lightColor = chroma(color).alpha(0.3).css();
			const complementaryColor = chroma(color).set('hsl.h', '+180').css();

			colors.backgroundColors.push(color);
			colors.lightColors.push(lightColor);
			colors.complementaryColors.push(complementaryColor);
	});

	return colors;
}

function NetWorthSummary({ summary }) {
	const { t } = useTranslation();

	const colors = GetRandomColors(Object.keys(summary).length);

	const data = {
		labels: Object.keys(summary),
		datasets: [{
			data: Object.values(summary),
			backgroundColor: colors.backgroundColors,
			hoverBackgroundColor: colors.lightColors,
			borderColor: '#000000'
		}]
	};

	const options = {
		responsive: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};

	return (
		<div class="net-worth-summary">
			<h2>{t('net_worth_summary_header')}</h2>
			<div class='graph-container'>
				<Pie
					data={data}
					width={300}
					height={300}
					options={options}
				/>
			</div>
		</div>
	)
}

function AccountHistogram({ monthly, yearly, networth }) {
	const { t } = useTranslation();
	const [view, setView] = useState('monthly');

	const options = {
		responsive: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};

	const getData = () => {
		switch (view) {
			case 'monthly':
				return {
					labels: monthly.map(snapshot => snapshot.date),
					datasets:
						distinctAccounts.map((accountName, idx) => {
							return {
								label: accountName,
								data: monthly.map(snapshot => {
									const account = snapshot.snapshots.find(s => s.name === accountName);
									return account ? account.balance : null;
								}),
								borderColor: colors.backgroundColors[idx],
								backgroundColor: colors.lightColors[idx]
							};
						})
				};
			case 'yearly':
				return {
					labels: yearly.map(snapshot => snapshot.date),
					datasets:
						distinctAccounts.map((accountName, idx) => {
							return {
								label: accountName,
								data: yearly.map(snapshot => {
									const account = snapshot.snapshots.find(s => s.name === accountName);
									return account ? account.balance : null;
								}),
								borderColor: colors.backgroundColors[idx],
								backgroundColor: colors.lightColors[idx]
							};
						})
				};
			case 'total':
				console.log(networth);
				return {
					labels: networth.map(snapshot => snapshot.date),
					datasets: [{
						label: t('net_worth'),
						data: networth.map(snapshot => snapshot.value),
						borderColor: colors.backgroundColors[0],
						backgroundColor: colors.lightColors[0]
					}]
				};
			default:
				return monthly;
		}
	};

	const maxLength = Math.max(...monthly.map(snapshot => snapshot.snapshots.length));

	const colors = GetRandomColors(maxLength);

	const distinctAccounts = monthly.map(snapshot => snapshot.snapshots.map(s => s.name)).flat().filter((value, index, self) => self.indexOf(value) === index);

	return (
		<div class="account-histogram">
			<h2>{t('account_histogram_header')}</h2>
			<div className="graph-options">
				<button onClick={() => setView('monthly')}>{t('monthly')}</button>
				<button onClick={() => setView('yearly')}>{t('yearly')}</button>
				<button onClick={() => setView('total')}>{t('total')}</button>
			</div>
			<div class='graph-container'>
				<Line
					height={300}
					width={600}
					data={getData()}
					options={options} />
			</div>
		</div>
	);
}

function AccountTable({ accounts}) {
	const { t, i18n } = useTranslation();

	const formatAmount = (amount, locale) => {
		return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount);
	};

	const locale = i18n.language === 'en' ? 'en-US' : 'pt-BR';
	return (
		<div class="account-summary-list">
			<h2>{t('account_summary_header')}</h2>
			<div class="account-summary-box">
				<div class="account-summary-header">{t('account_name')}</div>
				<div class="account-summary-header">{t('current_amount')}</div>
				<div class="account-summary-header">{t('mom_change')}</div>
			</div>
			{accounts.map((account) => (
			<div class="account-summary-row" key={account.name}>
				<div class="account-summary-name">{account.name}</div>
				<div class="account-summary-value">{formatAmount(account.balance)}</div>
				<div class={"account-summary-mom-increase ".concat(account.percent_change > 0 ? 'green' : 'red')} >
					{account.percent_change > 0 ? '↑' : '↓'} {formatAmount(account.percent_change.toFixed(2))}%
				</div>
			</div>
			))}
		</div>
	);
}

export default App;
