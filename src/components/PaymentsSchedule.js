import React from 'react';

export default function PaymentsSchedule({ values }) {
	const { startDate, loan, installmentAmount, interestRate, installmentInterval, payment, loanTerm } = values;

	const table = scheduleArray => (
		<table className='table m-3'>
			<thead>
				<tr>
					<th scope='col'>#</th>
					<th scope='col'>Date</th>
					<th scope='col'>Payment</th>
				</tr>
			</thead>
			<tbody>
				{scheduleArray.map((date, i) => (
					<tr key={i}>
						<th scope='row'>{i}</th>
						<td>{date}</td>
						<td>{payment}</td>
					</tr>
				))}
			</tbody>
		</table>
	);

	const schedulePayments = () => {
		let date = startDate.split('-').join(' ');
		let d = new Date(date);
		let scheduleArray = [];
		let seq = 0;
		let temp;

		const addToArray = d => {
			temp = d.toISOString().slice(0, 10);
			scheduleArray.push(temp);
		};

		const weekendDate = d => {
			if (d.getDay() === 6) {
				d = new Date(d.setDate(d.getDate() + 2));
				addToArray(d);
			} else if (d.getDay() === 0) {
				d = new Date(d.setDate(d.getDate() + 1));
				addToArray(d);
			} else {
				addToArray(d);
			}
		};

		if (installmentInterval === 'months' || installmentInterval === 'years') {
			while (loanTerm > seq) {
				d = new Date(d.setMonth(d.getMonth() + 1));
				weekendDate(d);
				seq++;
			}
		}
		if (installmentInterval === 'days') {
			while (loanTerm > seq) {
				d = new Date(d.setDate(d.getDate() + 1));
				weekendDate(d);
				seq++;
			}
		}

		return (
			<>
				<h5 className='m-3 bg-success text-white p-2'>
					Estimated payoff date: {scheduleArray[scheduleArray.length - 1]}
				</h5>
				{table(scheduleArray)}
			</>
		);
	};

	return <>{schedulePayments()}</>;
}
