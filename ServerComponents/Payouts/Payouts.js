'use strict';

const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');
const PayoutDatabaseSaver = require('./PayoutDatabaseSaver/PayoutDatabaseSaver.js');
const PayoutMethodQuerier = require('./PayoutMethodQuerier/PayoutMethodQuerier.js');
const CreatePayout = require('./CreatePayout/CreatePayout.js');
const StripeTokenCreator = require('./StripeTokenCreator/StripeTokenCreator.js');

class Payouts {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.plaid = global.getPlaid();
		this.paymentPlatform = global.getPaymentPlatform()
		this.database = global.getDatabase()
		this.payoutDatabaseSaver = new PayoutDatabaseSaver(this.paymentPlatform, this.database);
		this.payoutMethodQuerier = new PayoutMethodQuerier(this.database, this.paymentPlatform);
		this.createPayout = new CreatePayout(this.paymentPlatform, this.database);
		this.stripeTokenCreator = new StripeTokenCreator(this.plaid);
	}

	async savePayout(body){
		try {
			const stripeToken = await this.stripeTokenCreator.createToken(body.plaidToken, body.currency)
			const	response = await this.payoutDatabaseSaver.savePayout(body.email, stripeToken);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async retrievePayoutMethods(body){
		try {
			const	response = await this.payoutMethodQuerier.queryMethods(body.email);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async createPlatformPayout(body){
		try {
			const	response = await this.createPayout.create(body.email, body.destinationID, body.amount, body.currency, body.last4);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = Payouts;
