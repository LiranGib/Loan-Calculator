import React, { useState } from 'react';
// import { calculatePayments } from '../controllers/loan.controller';

const LoanForm = () => {
	const [values, setValues] = useState({
		// startDate: '',
		loan: '',
		installmentAmount: '',
		interestRate: '',
		installmentInterval: '',
		payment: ''
	});

	const { startDate, loan, installmentAmount, interestRate, installmentInterval, payment } = values;

	const monthlyPayment = term => {
		let interest = interestRate / 1200;
		let monthlyPayment = (loan * interest) / (1 - Math.pow(1 / (1 + interest), term));
		monthlyPayment = +(Math.round(monthlyPayment + 'e+2') + 'e-2');

		setValues({
			...values,
			payment: monthlyPayment
		});
	};

	const calculatePayments = () => {
		if (installmentInterval === 'years') {
			let term = installmentAmount * 12;
			monthlyPayment(term);
		}
		if (installmentInterval === 'months') {
			let term = installmentAmount;
			monthlyPayment(term);
		}
		if (installmentInterval === 'days') {
			let term = (installmentAmount / 365) * 12;
			monthlyPayment(term);
		}
	};

	const clickSubmit = event => {
		event.preventDefault();
		calculatePayments();
	};

	const handleChange = name => event => {
		const value = event.target.value;
		setValues({ ...values, [name]: value });
	};

	const loanForm = () => (
		<form className='m-3' onSubmit={clickSubmit}>
			{/* <div className='form-group'>
				<label className='text-muted'>Start Date</label>
				<input
					onChange={handleChange('startDate')}
					type='date'
					className='form-control'
					value={startDate}
					required
				/>
			</div> */}

			<div className='form-group'>
				<label className='text-muted'>Loan Amount ($)</label>
				<input
					onChange={handleChange('loan')}
					type='number'
					className='form-control'
					min='0'
					value={loan}
					required
				/>
			</div>

			<div className='form-group'>
				<label className='text-muted'>Installment Amount</label>
				<input
					onChange={handleChange('installmentAmount')}
					type='number'
					className='form-control'
					value={installmentAmount}
					required
				/>
			</div>

			<div className='form-group'>
				<label className='text-muted'>Interest Rate (%)</label>
				<input
					onChange={handleChange('interestRate')}
					type='number'
					className='form-control'
					value={interestRate}
					min='0'
					max='20'
					step='0.1'
					required
				/>
			</div>

			<div className='form-group'>
				<label className='text-muted'>Installment Interval</label>
				<select onChange={handleChange('installmentInterval')} className='form-control' required>
					<option>Please select</option>
					<option value='days'>Days</option>
					<option value='months'>Months</option>
					<option value='years'>Years</option>
				</select>
			</div>

			<button className='btn btn-outline-primary'>Calculate</button>
		</form>
	);

	return (
		<>
			{loanForm()}
			{installmentInterval === 'days' ? (
				<h5 className='m-3'>Daily Payment {payment}</h5>
			) : (
				<h5 className='m-3'>Monthly Payment {payment}</h5>
			)}
		</>
	);
};

export default LoanForm;
