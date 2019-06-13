'use strict';

const IncomingPaymentsQuerier = require('./IncomingPaymentsQuerier.js')
const OutgoingPayoutsQuerier = require('./OutgoingPayoutsQuerier.js')
const BalanceQuerier = require('./BalanceQuerier.js')

class DashboardBank {
	constructor(global){
		this.database = global.getDatabase();
		this.paymentPlatform = global.getPaymentPlatform();
		this.incomingPaymentsQuerier = new IncomingPaymentsQuerier(this.database, this.paymentPlatform);
		this.outgoingPayoutsQuerier = new OutgoingPayoutsQuerier(this.database);
		this.balanceQuerier = new BalanceQuerier(this.database, this.paymentPlatform);
	}

	async incoming(email){
		try {
			const paymentsInformation = await this.incomingPaymentsQuerier.queryPayments(email);

			return paymentsInformation;
		} catch(exception) {
			throw exception;
		}	
	}

	async outgoing(email){
		try {
			const payoutsInformation = await this.outgoingPayoutsQuerier.queryPayouts(email);

			return payoutsInformation;
		} catch(exception) {
			throw exception;
		}	
	}

	async balances(email, currency){
		try {
			const payoutsInformation = await this.balanceQuerier.queryBalances(email, currency);

			return payoutsInformation;
		} catch(exception) {
			throw exception;
		}	
	}
}

module.exports = DashboardBank;
