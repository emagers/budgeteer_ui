import logo from './logo.svg';
import './App.css';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
	return (
		<div>
		<NavBar />
		<div class="body-panels">
			<div class="bp" />
			<div>
				<NetWorthSummary />
				<AccountHistogram />
				<AccountTable />
			</div>
			<div class="bp" />
		</div>
		</div>
	);
}

function NavBar() {
	const { t, i18n } = useTranslation();
	const name = "John Doe";

	// create a function to switch the language
	const on_switch = () => {
		i18n.changeLanguage(i18n.language === 'en' ? 'br' : 'en');
	}

	return (
		<div class="navbar">
			<div class="navbar-div">{t('navbar_welcome')} {name}!</div>
			<div class="navbar-div"><a href="/logout">logout</a></div>
			<div class="navbar-div">
				<button onClick={on_switch}>
					{t('navbar_switch_language')}
				</button>
			</div>
		</div>
	)
}

function NetWorthSummary() {
	const { t } = useTranslation();
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
	const data = {
		labels: [ "Liquid Cash", "Retirement", "Stocks"],
		datasets: [{
			data: [1000, 20000, 5000],
			backgroundColor: COLORS,
			hoverBackgroundColor: COLORS,
			borderColor: '#000000'
		}]};

	const options = {
		responsive: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	}; //{ maintainAspectRatio: false, aspectRation:1 }

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

function AccountHistogram() {
	const { t } = useTranslation();

	const options = {
		responsive: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};

	const data = {
		labels: [
			'Jan 2022', 'Feb 2022', 'Mar 2022', 'Apr 2022', 'May 2022', 'Jun 2022',
			'Jul 2022', 'Aug 2022', 'Sep 2022', 'Oct 2022', 'Nov 2022', 'Dec 2022',
			'Jan 2023', 'Feb 2023', 'Mar 2023', 'Apr 2023', 'May 2023', 'Jun 2023',
			'Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023',
			'Jan 2024', 'Jan 2025', 'Jan 2028', 'Jan 2033'
		],
		datasets: [
			{
				label: 'US Bank',
				data: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, null, null, null, null, null, null, null, null, null, null, null],
				borderColor: '#FF6384',
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
			},
			{
				label: 'Chase',
				data: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, null, null, null, null, null, null, null, null, null, null, null],
				borderColor: '#36A2EB',
				backgroundColor: 'rgba(54, 162, 235, 0.2)',
			},
			{
				label: 'CIT',
				data: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, null, null, null, null, null, null, null, null, null, null, null],
				borderColor: '#FFCE56',
				backgroundColor: 'rgba(255, 206, 86, 0.2)',
			},
			{
				label: 'Fidelity - Individual',
				data: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, null, null, null, null, null, null, null, null, null, null, null],
				borderColor: '#4BC0C0',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
			},
			{
				label: 'US Bank (Projected)',
				data: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300],
				borderColor: '#FF6384',
				borderDash: [5, 5],
				backgroundColor: 'rgba(255, 99, 133, 0.58)',
			},
			{
				label: 'Chase (Projected)',
				data: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200],
				borderColor: '#36A2EB',
				borderDash: [5, 5],
				backgroundColor: 'rgba(54, 163, 235, 0.57)',
			},
			{
				label: 'CIT (Projected)',
				data: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000],
				borderColor: '#FFCE56',
				borderDash: [5, 5],
				backgroundColor: 'rgba(255, 207, 86, 0.51)',
			},
			{
				label: 'Fidelity - Individual (Projected)',
				data: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900],
				borderColor: '#4BC0C0',
				borderDash: [5, 5],
				backgroundColor: 'rgba(75, 192, 192, 0.52)',
			},
		],
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

function AccountTable() {
	const { t, i18n } = useTranslation();

	// Create a grid which displays all the accounts and their currend dollar amounts. The grid should have the following columns: Account Name, Month-over-month change percentage (with a red down or green up arrow), and current dollar amount.
	const accounts = [
		{ name: 'US Bank', change: 2.5, amount: 2200 },
		{ name: 'Chase', change: -1.2, amount: 2100 },
		{ name: 'CIT', change: 3.1, amount: 2000 },
		{ name: 'Fidelity - Individual', change: 0.5, amount: 1900 },
	];

	//the output account.amount should be output such as the thousands separator and decimal characters reflect the current language. For US English, and example would be 1,000.00. For Brazilian Portugues, that would be 1.000,00
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
				<div class="account-summary-value">{formatAmount(account.amount)}</div>
				<div class={"account-summary-mom-increase ".concat(account.change > 0 ? 'green' : 'red')} >
					{account.change > 0 ? '↑' : '↓'} {account.change}%
				</div>
			</div>
			))}
		</div>
	);
}

export default App;
