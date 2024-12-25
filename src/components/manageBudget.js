import React, { useState } from 'react';

function ManageBudgets() {
	const [budgetItems, setBudgetItems] = useState([]);
	const [newBudgetItem, setNewBudgetItem] = useState({
			name: '',
			account: '',
			type: 'deposit',
			frequency: 'one-time',
			recurringFrequency: '',
	});
	const [selectedAccount, setSelectedAccount] = useState('');

	const handleInputChange = (e) => {
			const { name, value } = e.target;
			setNewBudgetItem({ ...newBudgetItem, [name]: value });
	};

	const handleAccountChange = (e) => {
			setSelectedAccount(e.target.value);
	};

	const addBudgetItem = () => {
			// Stub for API interaction
			setBudgetItems([...budgetItems, newBudgetItem]);
			setNewBudgetItem({
					name: '',
					account: '',
					type: 'deposit',
					frequency: 'one-time',
					recurringFrequency: '',
			});
	};

	const updateBudgetItem = (index, updatedItem) => {
			// Stub for API interaction
			const updatedItems = budgetItems.map((item, i) => (i === index ? updatedItem : item));
			setBudgetItems(updatedItems);
	};

	const filteredBudgetItems = budgetItems.filter(item => item.account === selectedAccount);

	return (
			<div className="manage-budgets">
					<h2>Manage Budgets</h2>
					<div className="budget-form">
							<input
									type="text"
									name="name"
									placeholder="Budget Item Name"
									value={newBudgetItem.name}
									onChange={handleInputChange}
							/>
							<input
									type="text"
									name="account"
									placeholder="Account"
									value={newBudgetItem.account}
									onChange={handleInputChange}
							/>
							<select name="type" value={newBudgetItem.type} onChange={handleInputChange}>
									<option value="deposit">Deposit</option>
									<option value="withdrawal">Withdrawal</option>
							</select>
							<select name="frequency" value={newBudgetItem.frequency} onChange={handleInputChange}>
									<option value="one-time">One-time</option>
									<option value="recurring">Recurring</option>
							</select>
							{newBudgetItem.frequency === 'recurring' && (
									<select
											name="recurringFrequency"
											value={newBudgetItem.recurringFrequency}
											onChange={handleInputChange}
									>
											<option value="daily">Once a day</option>
											<option value="weekly">Once a week</option>
											<option value="monthly">Once a month</option>
											<option value="monthly-15th">Recurring on the 15th of every month</option>
									</select>
							)}
							<button onClick={addBudgetItem}>Add Budget Item</button>
					</div>
					<div className="account-selector">
							<select value={selectedAccount} onChange={handleAccountChange}>
									<option value="">Select Account</option>
									{Array.from(new Set(budgetItems.map(item => item.account))).map(account => (
											<option key={account} value={account}>{account}</option>
									))}
							</select>
					</div>
					<div className="budget-items">
							{filteredBudgetItems.map((item, index) => (
									<div key={index} className="budget-item">
											<h3>{item.name}</h3>
											<p>Account: {item.account}</p>
											<p>Type: {item.type}</p>
											<p>Frequency: {item.frequency}</p>
											{item.frequency === 'recurring' && <p>Recurring Frequency: {item.recurringFrequency}</p>}
											<button onClick={() => updateBudgetItem(index, { ...item, name: 'Updated Name' })}>
													Update
											</button>
									</div>
							))}
					</div>
			</div>
	);
}


export default ManageBudgets;