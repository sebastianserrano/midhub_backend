'use strict';

const PaymentsErrorHandler = require('../../Error/ErrorHandler/PaymentsErrorHandler.js');

const Promise = require('bluebird');

class PayoutsPaymentPlatformQuerier {
	constructor(platform){
		this.platform = platform;
		this.paymentsErrorHandler = new PaymentsErrorHandler();
	}

	queryPayouts(email){
		return new Promise((resolve, reject) => {
			this.platform.customers.create({
				email: email
			}, (error, response) => {
				if(response) resolve({ id: response.id });
				if(error) reject(error);
			})
		})
	}
}

module.exports = PayoutsPaymentPlatformQuerier;
