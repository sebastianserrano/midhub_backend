'use strict';

const PaymentsReleasedQuerier = require('./PaymentsReleasedQuerier.js')
const PaymentsReceivedQuerier = require('./PaymentsReceivedQuerier.js')

class DashboardPayments {
	constructor(global){
		this.database = global.getDatabase();
		this.paymentsReleasedQuerier = new PaymentsReleasedQuerier(this.database);
		this.paymentsReceivedQuerier = new PaymentsReceivedQuerier(this.database);
	}

	async released(email){
		try {
			const paymentsInformation = await this.paymentsReleasedQuerier.queryPayments(email);

			return paymentsInformation;
		} catch(exception) {
			throw exception;
		}	
	}

	async received(email){
		try {
			const paymentsInformation = await this.paymentsReceivedQuerier.queryPayments(email);

			return paymentsInformation;
		} catch(exception) {
			throw exception;
		}	
	}
}

module.exports = DashboardPayments;
