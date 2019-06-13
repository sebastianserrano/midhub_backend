'use strict';

const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');
const PaymentCardSaver = require('./PaymentCardSaver/PaymentCardSaver.js');
const PaymentCardsQuerier = require('./PaymentCardsQuerier/PaymentCardsQuerier.js');

class PaymentCardHandler {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.paymentPlatform = global.getPaymentPlatform()
		this.database = global.getDatabase()
		this.paymentCardSaver = new PaymentCardSaver(this.database, this.paymentPlatform)
		this.paymentCardsQuerier = new PaymentCardsQuerier(this.database, this.paymentPlatform)
	}

	async saveCard(userEmail, card){
		try {
			const	response = await this.paymentCardSaver.save(userEmail, card);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async queryCards(userEmail){
		try {
			const	response = await this.paymentCardsQuerier.queryCards(userEmail);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = PaymentCardHandler;
