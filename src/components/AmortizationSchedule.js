import React from 'react';
import moment from 'moment';
import fedHolidays from '@18f/us-federal-holidays';

export default function AmortizationSchedule({ values }) {
	const { startDate, installmentInterval, payment, loanTerm, loan, calcInterest } = values;

	const amortization = (schedule, interest) => {
		let scheduleArray = schedule();
		let interestArray = interest();
		let combinedArray = scheduleArray.map((ele, i) => {
			return [ele, interestArray[i]];
		});

		return (
			<>
				<p className='bg-success text-white p-1 rounded'>
					Estimated payoff date:{' '}
					<span className='pl-2 text-warning font-weight-bold'>{scheduleArray[scheduleArray.length - 1]}</span>
				</p>
				<table className='table table-striped small'>
					<thead>
						<tr>
							<th scope='col'>Pmt #</th>
							<th scope='col'>Date</th>
							<th scope='col'>Payment Amount</th>
							<th scope='col'>Principal Amount</th>
							<th scope='col'>Interest Amount</th>
							<th scope='col'>Balance</th>
						</tr>
					</thead>
					<tbody>
						{combinedArray.map((ele, i) => (
							<tr key={i}>
								<th scope='row'>{i + 1}</th>
								<td>{ele[0]}</td>
								<td>{`$${ele[1][0].toLocaleString()}`}</td>
								<td>{`$${ele[1][1].toLocaleString()}`}</td>
								<td>{`$${ele[1][2].toLocaleString()}`}</td>
								<td>{`$${ele[1][3].toLocaleString()}`}</td>
							</tr>
						))}
					</tbody>
				</table>
			</>
		);
	};

	const checkWeekends = d => {
		if (d.getDay() === 6) {
			d = new Date(d.setDate(d.getDate() + 2));
		}
		if (d.getDay() === 0) {
			d = new Date(d.setDate(d.getDate() + 1));
		}
	};

	const checkHoliday = d => {
		const options = {
			shiftSaturdayHolidays: false,
			shiftSundayHolidays: false,
			utc: false
		};
		if (fedHolidays.isAHoliday(d, options)) {
			d = new Date(d.setDate(d.getDate() + 1));
		}
	};

	const calcInterestAmount = () => {
		let seq = 0;
		let loanBalance = loan;
		let interestAmount, principalAmount;
		let tempArr = [];

		while (loanTerm > seq) {
			interestAmount = +(Math.round(calcInterest * loanBalance + 'e+2') + 'e-2');
			principalAmount = +(Math.round(payment - interestAmount + 'e+2') + 'e-2');
			if (principalAmount < loanBalance) {
				loanBalance -= principalAmount;
				loanBalance = +(Math.round(loanBalance + 'e+2') + 'e-2');
				tempArr.push([payment, principalAmount, interestAmount, loanBalance]);
			} else {
				principalAmount = loanBalance;
				loanBalance = 0;
				let lastPayment = principalAmount + interestAmount;
				tempArr.push([lastPayment, principalAmount, interestAmount, loanBalance]);
			}
			seq++;
		}
		return tempArr;
	};

	const schedulePayments = () => {
		let date = startDate.split('-').join(' ');
		let d = new Date(date);
		let scheduleArray = [];
		let seq = 0;
		let formatDate;

		const addToArray = d => {
			formatDate = moment(d).format('L');
			scheduleArray.push(formatDate);
		};

		if (installmentInterval === 'months' || installmentInterval === 'years') {
			d = new Date(d.setMonth(d.getMonth() - 1));
			while (loanTerm > seq) {
				d = new Date(d.setMonth(d.getMonth() + 1));
				checkHoliday(d);
				checkWeekends(d);
				addToArray(d);
				seq++;
			}
		}
		if (installmentInterval === 'days') {
			d = new Date(d.setDate(d.getDate() - 1));
			while (loanTerm > seq) {
				d = new Date(d.setDate(d.getDate() + 1));
				checkHoliday(d);
				checkWeekends(d);
				addToArray(d);
				seq++;
			}
		}
		return scheduleArray;
	};

	return <>{amortization(schedulePayments, calcInterestAmount)}</>;
}
