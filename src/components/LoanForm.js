import React, { useState } from 'react';
import AmortizationSchedule from './AmortizationSchedule';

const LoanForm = () => {
	const [values, setValues] = useState({
		startDate: '',
		loan: '',
		installmentAmount: '',
		interestRate: '',
		installmentInterval: '',
		payment: '',
		loanTerm: '',
		calcInterest: ''
	});

	const { startDate, loan, installmentAmount, interestRate, installmentInterval, payment } = values;

	//Calculating the monthly/daily payment
	const installmentPayment = (term, interest) => {
		// breaking annual interest into monthly interest
		interest = +(Math.round((interest || interestRate / 1200) + 'e+7') + 'e-7');
		let paymentAmount = (loan * interest) / (1 - Math.pow(1 / (1 + interest), term));
		//Round to at most 2 decimal places
		paymentAmount = +(Math.round(paymentAmount + 'e+2') + 'e-2');

		setValues({
			...values,
			payment: paymentAmount,
			loanTerm: term,
			calcInterest: interest
		});
	};

	const calculatePayments = () => {
		if (installmentInterval === 'years') {
			let term = installmentAmount * 12;
			installmentPayment(term);
		}
		if (installmentInterval === 'months') {
			let term = installmentAmount;
			installmentPayment(term);
		}
		if (installmentInterval === 'days') {
			let term = installmentAmount;
			// breaking annual interest into daily interest
			let interest = interestRate / 36000;
			installmentPayment(term, interest);
		}
	};

	const clickSubmit = event => {
		event.preventDefault();
		calculatePayments();
	};

	const handleChange = name => event => {
		let today = new Date();
		let userDate = new Date(event.target.value);
		if (name === 'startDate' && userDate < today) {
			window.alert('Date can not be in the past!');
		} else {
			const value = event.target.value;
			setValues({ ...values, [name]: value });
		}
	};

	const loanForm = () => (
		<form onSubmit={clickSubmit}>
			<div className='form-group'>
				<input
					onChange={handleChange('startDate')}
					type='date'
					className='form-control'
					placeholder='Start Date'
					value={startDate}
					required
				/>
			</div>

			<div className='form-group'>
				<div className='input-group'>
					<div className='input-group-prepend'>
						<div className='input-group-text'>$</div>
					</div>
					<input
						onChange={handleChange('loan')}
						type='number'
						className='form-control'
						placeholder='Loan Amount'
						min='0'
						value={loan}
						required
					/>
				</div>
			</div>

			<div className='form-group'>
				<input
					onChange={handleChange('installmentAmount')}
					type='number'
					className='form-control'
					placeholder='Installment Amount'
					value={installmentAmount}
					required
				/>
			</div>

			<div className='form-group'>
				<div className='input-group'>
					<div className='input-group-prepend'>
						<div className='input-group-text'>%</div>
					</div>
					<input
						onChange={handleChange('interestRate')}
						type='number'
						className='form-control'
						placeholder='Interest Rate'
						value={interestRate}
						min='0'
						max='20'
						step='0.1'
						required
					/>
				</div>
			</div>

			<div className='form-group'>
				<select onChange={handleChange('installmentInterval')} className='form-control text-muted' required>
					<option defaultValue>Choose Interval</option>
					<option value='days'>Days</option>
					<option value='months'>Months</option>
					<option value='years'>Years</option>
				</select>
			</div>

			<button className='btn btn-outline-primary'>Calculate</button>

			{installmentInterval === 'days' ? (
				<p className='bg-primary text-white mt-3 p-1 rounded'>
					Daily Payment <span className='pl-2 text-warning font-weight-bold'>{payment}</span>
				</p>
			) : (
				<p className='bg-primary text-white mt-3 p-1 rounded'>
					Monthly Payment <span className='pl-2 text-warning font-weight-bold'>{payment}</span>
				</p>
			)}
		</form>
	);

	return (
		<div className='container'>
			<div className='row'>
				<div className='col-md-4'>{loanForm()}</div>
				<div className='col-md-8 table-sm'>
					<AmortizationSchedule values={values} />
				</div>
			</div>
		</div>
	);
};

export default LoanForm;
