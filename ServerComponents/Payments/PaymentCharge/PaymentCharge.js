'use strict';

const ConnectAccountIDQuerier = require('./ConnectAccountIDQuerier.js');
const CustomerAccountIDQuerier = require('./CustomerAccountIDQuerier.js');
const PaymentsErrorHandler = require('../../Error/ErrorHandler/PaymentsErrorHandler.js');
const Promise = require('bluebird');

class PaymentCharge {
	constructor(platform, database){
		this.platform = platform;
		this.connectAccountIDQuerier = new ConnectAccountIDQuerier(database);
		this.customerAccountIDQuerier = new CustomerAccountIDQuerier(database);
		this.paymentsErrorHandler = new PaymentsErrorHandler();
	}

	async chargeCard(amount, amountAfterFees, currency, source, destinationEmail, customerEmail){
		const destination = await this.connectAccountIDQuerier.queryConnectAccount(destinationEmail)

		return new Promise((resolve, reject) => {
			this.platform.charges.create({
				amount: amount,
				capture: false,
				receipt_email: customerEmail,
				currency: currency,
				source: source,
				transfer_data: {
					amount: amountAfterFees,
					destination: destination["User Payment Connect ID"]
				}
			}).then(paymentPlatformResponse => {
				const response = {
					info: paymentPlatformResponse,
					status: "Successful"
				}
				resolve(response)
			}).catch(exception => {
				const error = this.paymentsErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	async chargeSavedCard(amount, amountAfterFees, currency, customerEmail, source, destinationEmail){
		const destination = await this.connectAccountIDQuerier.queryConnectAccount(destinationEmail)
		const customer = await this.customerAccountIDQuerier.queryCustomerAccount(customerEmail)

		return new Promise((resolve, reject) => {
			this.platform.charges.create({
				amount: amount,
				capture: false,
				currency: currency,
				receipt_email: customerEmail,
				customer: customer["User Payment Customer ID"],
				source: source,
				transfer_data: {
					amount: amountAfterFees,
					destination: destination["User Payment Connect ID"]
				}
			}).then(paymentPlatformResponse => {
				const response = {
					info: paymentPlatformResponse,
					status: "Successful"
				}
				resolve(response)
			}).catch(exception => {
				const error = this.paymentsErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}
}

module.exports = PaymentCharge;
