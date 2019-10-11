import React from 'react';
import moment from 'moment';
import fedHolidays from '@18f/us-federal-holidays';

export default function PaymentsSchedule({ values }) {
	const { startDate, installmentInterval, payment, loanTerm } = values;

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
		let formatDate;

		const addToArray = d => {
			formatDate = moment(d).format('MMM Do YY');
			scheduleArray.push(formatDate);
		};

		const weekendDate = d => {
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

		if (installmentInterval === 'months' || installmentInterval === 'years') {
			d = new Date(d.setMonth(d.getMonth() - 1));
			while (loanTerm > seq) {
				d = new Date(d.setMonth(d.getMonth() + 1));
				checkHoliday(d);
				weekendDate(d);
				addToArray(d);
				seq++;
			}
		}
		if (installmentInterval === 'days') {
			d = new Date(d.setDate(d.getDate() - 1));
			while (loanTerm > seq) {
				d = new Date(d.setDate(d.getDate() + 1));
				checkHoliday(d);
				weekendDate(d);
				addToArray(d);
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
