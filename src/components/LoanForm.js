import React, { useState } from 'react';
import PaymentsSchedule from './PaymentsSchedule';

const LoanForm = () => {
	const [values, setValues] = useState({
		startDate: '',
		loan: '',
		installmentAmount: '',
		interestRate: '',
		installmentInterval: '',
		payment: '',
		loanTerm: ''
	});

	const { startDate, loan, installmentAmount, interestRate, installmentInterval, payment, loanTerm } = values;

	//Calculating the monthly/daily payment
	const installmentPayment = (term, interest) => {
		interest = interest || interestRate / 1200;
		let paymentAmount = (loan * interest) / (1 - Math.pow(1 / (1 + interest), term));
		//Round to at most 2 decimal places
		paymentAmount = +(Math.round(paymentAmount + 'e+2') + 'e-2');

		setValues({
			...values,
			payment: paymentAmount,
			loanTerm: term
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
			let interest = interestRate / 36000;
			installmentPayment(term, interest);
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
			<div className='form-group'>
				<label className='text-muted'>Start Date</label>
				<input
					onChange={handleChange('startDate')}
					type='date'
					className='form-control'
					value={startDate}
					required
				/>
			</div>

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
				<h5 className='bg-primary text-white m-3 mt-5 p-2'>Daily Payment {payment}</h5>
			) : (
				<h5 className='bg-primary text-white m-3 mt-5 p-2'>Monthly Payment {payment} </h5>
			)}
			<PaymentsSchedule values={values} />
		</>
	);
};

export default LoanForm;
