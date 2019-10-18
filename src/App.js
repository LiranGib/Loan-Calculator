import React from 'react';
import Loan from './components/LoanForm';
import './App.css';

function App() {
	return (
		<div>
			<h3 className='text-center m-3 pb-4'>Loan Calculator</h3>
			<Loan />
		</div>
	);
}

export default App;
