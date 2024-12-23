import './App.css';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Pie, Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
				<AccountHistogram history={data['snapshot_history']} />
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

	return (
		<div class="navbar">
			<div class="navbar-div">{t('navbar_welcome')} {name}!</div>
			<div class="navbar-div"><a href="/logout">logout</a></div>
			<div class="navbar-div">
				<div onClick={on_switch} class="navbar-button">
					<span>
						{flagemojiToPNG(getFlagEmoji(i18n.language))}
					</span>
					<span>
						{t('navbar_switch_language')}
					</span>
				</div>
			</div>
		</div>
	)
}

// const COLORS = [
// 	'#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
// 	'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
// 	'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399'
// ];
// /// Create a list of 30 colors that are a much whiter version of the colors above, they should correspond to the colors above in order
// const LIGHTER_COLORS = COLORS.map(color => {
// 	const colorObj = new Option().style;
// 	colorObj.color = color;
// 	const rgb = colorObj.color.match(/\d+/g).map(Number);
// 	return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`;
// });

// const COMPLEMENTARY_COLORS = [
// 	'#00CCFF', '#004C99', '#00CC00', '#000066', '#FF4C4C', '#1A66FF', '#FFCC00', '#666600', '#660066', '#4DFF4D',
// 	'#FF4D4D', '#FF6600', '#1A1AFF', '#FFB3B3', '#FFCC99', '#00FF99', '#0033CC', '#00FFCC', '#FF9933', '#CCFF33',
// 	'#FF66CC', '#FF1A1A', '#00FF66', '#FF3300', '#FF99FF', '#FFCC66', '#00FF33', '#FF66FF', '#FF4DFF', '#FF1AFF'
// ];

function GetRandomColors(num) {

	const colors = {
		backgroundColors: [],
		lightColors: [],
		complementaryColors: []
	};
	for (let i = 0; i < num; i++) {
// There should never be any duplicates in the random colors picked, and there should be enough contrast against a white background.
		let color = '#' + Math.floor(Math.random() * 16777215).toString(16);

		// Remove the hash at the start if it's there
		let hex = color.replace(/^#/, '');

		// Parse the r, g, b values
		let bigint = parseInt(hex, 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;

		colors.backgroundColors.push(color);
		colors.lightColors.push(`rgba(${r}, ${g}, ${b}, 0.3)`);
		colors.complementaryColors.push(`#${(0xFFFFFF - parseInt(hex, 16)).toString(16)}`);
	}
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

function AccountHistogram({ history }) {
	const { t } = useTranslation();

	const options = {
		responsive: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};

	const maxLength = Math.max(...history.map(snapshot => snapshot.snapshots.length));

	const colors = GetRandomColors(maxLength);

	const distinctAccounts = history.map(snapshot => snapshot.snapshots.map(s => s.name)).flat().filter((value, index, self) => self.indexOf(value) === index);

	const data = {
		labels: history.map(snapshot => snapshot.date),
		datasets:
			distinctAccounts.map((accountName, idx) => {
				return {
					label: accountName,
					data: history.map(snapshot => {
						const account = snapshot.snapshots.find(s => s.name === accountName);
						return account ? account.balance : null;
					}),
					borderColor: colors.backgroundColors[idx],
					backgroundColor: colors.lightColors[idx]
				};
			})
	};

	return (
		<div class="account-histogram">
			<h2>{t('account_histogram_header')}</h2>
			<div class='graph-container'>
				<Line
					height={300}
					width={600}
					data={data}
					options={options}
				/>
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
