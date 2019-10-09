exports.calculatePayments = (loan, installmentAmount, interestRate, installmentInterval) => {
	if (installmentInterval === 'years') {
		console.log(loan, installmentAmount, interestRate, installmentInterval);
		//payment = principle * monthly interest/(1 - (1/(1+MonthlyInterest)*Months))
		let loanMonths = parseInt(installmentAmount) * 12;
		return loanMonths;
	}
};
exports.calculateInterest = () => {};
