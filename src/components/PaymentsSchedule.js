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
		let scheduleArray = [];
		if (installmentInterval === 'months' || installmentInterval === 'years') {
			let seq = 0;
			while (loanTerm > seq) {
				const date = startDate.split('-').join(' ');
				const d = new Date(date);
				const newDate = new Date(d.setMonth(d.getMonth() + seq));
				const paymentDate = newDate.toISOString().slice(0, 10);
				scheduleArray.push(paymentDate);
				seq++;
			}
		}
		if (installmentInterval === 'days') {
			let seq = 0;
			while (loanTerm > seq) {
				const date = startDate.split('-').join(' ');
				const d = new Date(date);
				const newDate = new Date(d.setDate(d.getDate() + seq));
				const paymentDate = newDate.toISOString().slice(0, 10);
				scheduleArray.push(paymentDate);
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
