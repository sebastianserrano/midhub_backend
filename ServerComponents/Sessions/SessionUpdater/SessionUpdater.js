'use strict';

const ErrorHandler = require('../../Error/ErrorHandler/ErrorHandler.js');
const Payments = require('../../Payments/Payments.js');
const PaymentCardHandler = require('../../Payments/PaymentCardHandler.js');
const SessionDatabaseUpdater = require('../SessionDatabaseUpdater/SessionDatabaseUpdater.js');

class SessionUpdater {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.sessionDatabaseUpdater = new SessionDatabaseUpdater(global);
		this.payments = new Payments(global);
		this.paymentCardHandler = new PaymentCardHandler(global)
	}

	async updateSessionWithFile(body){
		try {
			const	response = await this.sessionDatabaseUpdater.updateWithFile(body);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async updateSessionWithFunds(routes, body){
		var paymentResponse;
		var	response;
		var fundsLoadedPayload;

		try {
			switch(routes[3]){
				case 'charge_card':
					paymentResponse = await this.payments.chargeCard(body.paymentDetails)

					fundsLoadedPayload = {
						paymentDetails: this.buildLoadedFundsPaymentResponse(paymentResponse),
						sessionDetails: body.sessionDetails
					}
					response = await this.sessionDatabaseUpdater.updateWithFunds(fundsLoadedPayload);

					return response;
				case 'charge_saved_card':
					paymentResponse = await this.payments.chargeSavedCard(body.paymentDetails)
					fundsLoadedPayload = {
						paymentDetails: this.buildLoadedFundsPaymentResponse(paymentResponse),
						sessionDetails: body.sessionDetails
					}
					response = await this.sessionDatabaseUpdater.updateWithFunds(fundsLoadedPayload);

					return response;
				default:
					return
			}

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	buildLoadedFundsPaymentResponse(paymentResponse){
		const convertedAmountToDecimal = paymentResponse.info.amount / 100
		const convertedNetAmountToDecimal = paymentResponse.info.transfer_data.amount / 100;
		const convertedCurrency = paymentResponse.info.currency.toUpperCase();

		return {
			amount: convertedAmountToDecimal.toFixed(2),
			netAmount: convertedNetAmountToDecimal.toFixed(2),
			currency: convertedCurrency,
			paymentPlatformID: paymentResponse.info.id,
			method: paymentResponse.info.source.funding,
			issuer: paymentResponse.info.source.brand,
			lastFourDigits: paymentResponse.info.source.last4
		}	
	}

	async updateSessionUnavailable(body){
		try {
			const	response = await this.sessionDatabaseUpdater.updateSessionUnavailable(body);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
	
	async updateSessionCapturePayment(body){
		try {
			const response = await this.payments.capturePayment(body.sessionDetails)

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = SessionUpdater;
