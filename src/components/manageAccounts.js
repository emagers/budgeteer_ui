import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './loading';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';

function SelectAccount({ onSelect}) {
	const [selectedAccount, setSelectedAccount] = useState('');
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await axios.get('http://localhost:8080/account/1/acc');
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
		return <Loading />;
	}

	const handleAccountChange = (e) => {
		setSelectedAccount(e.target.value);
		onSelect(e.target.value);
	};

	return (
		<div className="account-selector">
			<select value={selectedAccount} onChange={handleAccountChange}>
				<option value="">Select Account</option>
				{Array.from(new Set(data.map(item => (<option key={item.name} value={item.id}>{item.name}</option>))))}
			</select>
		</div>
	);
}

function AccountDetails({ account }) {
	const { t } = useTranslation();
	return (
		<div className="account-details">
			<h3>{t('account_details')}</h3>
			<p>{account.name}</p>
			<p>{account.balance_history.at(-1).balance}</p>
			<ProfitLossBarChart profitLoss={account.profit_loss} />
		</div>
	);
}



function PositionItem({ position }) {
	const { t } = useTranslation();

	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = (e) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	const investmentType = Object.keys(position.investment_type)[0];
	const investmentValue = position.investment_type[investmentType];

	return (
		<>
			<div className="position-item" onClick={toggleExpand}>
				<h4>{position.name}</h4>
				<div className="position-item-value">
					<span>{t('value')}</span><span>{position.price != null ? position.price * investmentValue : investmentValue}</span>
				</div>
				{ isExpanded && (
					<>
						{position.ticker != null && (
						<div className="position-item-value">
							<span>{t('ticker')}</span><span>{position.ticker}</span>
						</div>)}
						<div className="position-item-value">
							<span>{t('investment_type')}</span><span>{investmentType}</span>
						</div>
						<div className="position-item-value">
							<span>{t('investment_type')}</span><span>{investmentValue}</span>
						</div>
						<div className="position-item-value">
							<span>{t('interest_apy')}</span><span>{position.interest_apy}</span>
						</div>
						<div className="position-item-actions">
							<button>{t('edit')}</button>
							<button>{t('delete')}</button>
						</div>
						<BudgetList budgetItems={position.budget_items} />
					</>)}
			</div>
		</>
	);
}

function PositionList({ positions }) {

	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = (e) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="position-list">
			<h3 onClick={toggleExpand}>{t('position_list')}
				<button className={`expand-button ${isExpanded ? 'expanded' : 'collapsed'}`}>
						<i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
				</button>
			</h3>
			{ isExpanded && (
			<ul>
				{positions.map((position) => (
					<li key={position.id}>
						<PositionItem position={position} />
					</li>
				))}
			</ul>) }
		</div>
	);
}

function BudgetItem({ item }) {
	const { t } = useTranslation();

	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = (e) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	const occuranceType = Object.keys(item.occurance)[0];
	const occuranceValue = item.occurance[occuranceType];

	function getNumberSubtext(num) {
		if (num === 1) {
			return "st";
		} else if (num === 2) {
			return "nd";
		} else if (num === 3) {
			return "rd";
		} else {
			return "th";
		}
	}


	return (
		<div className="budget-item" onClick={toggleExpand}>
			<h4>{item.name}</h4>
			<div className="budget-item-value">
				<span>{item.budget_type}</span>
				<span>
					{t('occurs')} {occuranceType} {occuranceValue != null ? (`on the ${occuranceValue}${getNumberSubtext(occuranceValue)}`) : ""}
				</span>
			</div>
			<div className="budget-item-value">
				<span>{t('amount')}</span>
				<span>
					{item.amount}
				</span>
			</div>
			<div className="budget-item-value">
				<span>{t('category')}</span><span>{item.category}</span>
			</div>
			<div className="budget-item-actions">
				<button>{t('edit')}</button>
				<button>{t('delete')}</button>
			</div>
		</div>
	);
}

function BudgetList({ budgetItems }) {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = (e) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="budget-list">
			<h3 onClick={toggleExpand}>{t('budget_list')}
				<button className={`expand-button ${isExpanded ? 'expanded' : 'collapsed'}`}>
						<i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
				</button>
			</h3>
			{ isExpanded && (
			<ul>
				{budgetItems.map((item) => (
					<li key={item.id}>
						<BudgetItem item={item} />
					</li>
				))}
			</ul>) }
		</div>
	);
}

function ProfitLossBarChart({ profitLoss }) {
	const { t } = useTranslation();

	const data = {
		labels: profitLoss.map(pl => pl.date),
		datasets: [
			{
				label: t('profit'),
				data: profitLoss.map(pl => pl.actual_profit),
				backgroundColor: 'rgba(9, 182, 3, 0.94)',
				borderColor: 'rgb(111, 255, 111)',
				borderWidth: 1,
			},
			{
				label: t('loss'),
				data: profitLoss.map(pl => pl.actual_loss),
				backgroundColor: 'rgb(250, 2, 56)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1
			},
			{
				label: t('budgeted_profit'),
				data: profitLoss.map((v, i) => {
					if (i === profitLoss.length - 1) {
						return v.budgeted_profit;
					} else {
						return null;
					}
				}),
				backgroundColor: 'rgb(106, 199, 126)',
				borderColor: 'rgb(111, 255, 111)',
				borderWidth: 1,
			},
			{
				label: t('budgeted_loss'),
				data: profitLoss.map((v, i) => {
					if (i === profitLoss.length - 1) {
						return v.budgeted_loss;
					} else {
						return null;
					}
				}),
				backgroundColor: 'rgba(255, 105, 137, 0.93)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1
			}
		]
	};

	return (
		<div className="profit-loss-bar-chart">
			<h3>{t('profit_loss')}</h3>
			<Bar
				data={data}
				options={{
					scales: {
						x: {
							stacked: true,
						},
						y: {
							stacked: true,
						},
					},
				}}
			/>
		</div>
	);
}

function ManageAccounts() {
	const { t } = useTranslation();
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [accountDetails, setAccountDetails] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchAccountDetails = async (accountId) => {
		console.log("Fetching account details for account ID: ", accountId);
		setLoading(true);
		try {
				const response = await axios.get(`http://localhost:8080/account/1/acc/${accountId}`);
				console.log("Account details response: ", response.data);
				setAccountDetails(response.data);
		} catch (error) {
				console.error('Error fetching account details:', error);
		} finally {
				setLoading(false);
		}
	};

	useEffect(() => {
		if (selectedAccount) {
				fetchAccountDetails(selectedAccount);
		}
	}, [selectedAccount]);

	const handleAccountSelect = (accountId) => {
		console.log("Selected account: ", accountId);
		setSelectedAccount(accountId);
	};

	return (
		<div className="manage-accounts">
			<h2>{t('manage_accounts')}</h2>
			<SelectAccount onSelect={handleAccountSelect} />
			{loading ? (<Loading />) : (accountDetails != null ? (
				<div>
					<AccountDetails account={accountDetails} />
					<PositionList positions={accountDetails.positions} />
				</div>
			) : null)}
		</div>
	);
}


export default ManageAccounts;