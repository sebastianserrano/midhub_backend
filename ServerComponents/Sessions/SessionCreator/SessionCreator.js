'use strict';

const ErrorHandler = require('../../Error/ErrorHandler/ErrorHandler.js');
const Payments = require('../../Payments/Payments.js');
const SessionDatabaseSaver = require('../../Sessions/SessionDatabaseSaver/SessionDatabaseSaver.js');
const PaymentCardHandler = require('../../Payments/PaymentCardHandler.js');

class SessionCreator {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.sessionDatabaseSaver = new SessionDatabaseSaver(global);
		this.payments = new Payments(global);
		this.paymentCardHandler = new PaymentCardHandler(global)
	}

	async createSessionWithFile(body){
		try {
			const	response = await this.sessionDatabaseSaver.fileUploaded(body);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async createSessionWithFunds(routes, body){
		var paymentResponse;
		var	response;
		var fundsLoadedPayload;

		try {
			switch(routes[3]){
				case 'charge_card':
					paymentResponse = await this.payments.chargeCard(body.paymentDetails)

					fundsLoadedPayload = {
						paymentResponse: this.buildLoadedFundsPaymentResponse(paymentResponse),
						sessionDetails: body.sessionDetails
					}
					response = await this.sessionDatabaseSaver.fundsLoaded(fundsLoadedPayload);

					return response;
				case 'charge_saved_card':
					paymentResponse = await this.payments.chargeSavedCard(body.paymentDetails)

					fundsLoadedPayload = {
						paymentResponse: this.buildLoadedFundsPaymentResponse(paymentResponse),
						sessionDetails: body.sessionDetails
					}
					response = await this.sessionDatabaseSaver.fundsLoaded(fundsLoadedPayload);

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
}

module.exports = SessionCreator;
