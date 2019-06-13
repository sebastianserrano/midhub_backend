'use strict';

const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');
const PaymentCharge = require('./PaymentCharge/PaymentCharge.js');
const PaymentCapture = require('./PaymentCapture/PaymentCapture.js');

class Payments {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.paymentPlatform = global.getPaymentPlatform()
		this.database = global.getDatabase()
		this.paymentCharge = new PaymentCharge(this.paymentPlatform, this.database);
		this.paymentCapture = new PaymentCapture(this.paymentPlatform, this.database);
	}

	async chargeCard(paymentDetails){
		try {
			const amount = this.convertAmountToInteger(paymentDetails.amount);
			const amountAfterFees = this.calculateAmountAfterFees(paymentDetails.amount);
			const currency = paymentDetails.currency;
			const source = paymentDetails.source;
			const destinationEmail = paymentDetails.destinationEmail
			const customerEmail = paymentDetails.customerEmail;

			const	paymentInfo = await this.paymentCharge.chargeCard(amount, amountAfterFees, currency, source, destinationEmail, customerEmail);

			return paymentInfo;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async chargeSavedCard(paymentDetails){
		try {
			const amount = this.convertAmountToInteger(paymentDetails.amount);
			const amountAfterFees = this.calculateAmountAfterFees(paymentDetails.amount);
			const currency = paymentDetails.currency;
			const source = paymentDetails.source;
			const customerEmail = paymentDetails.customerEmail;
			const destinationEmail = paymentDetails.destinationEmail

			const	paymentInfo = await this.paymentCharge.chargeSavedCard(amount, amountAfterFees, currency, customerEmail, source, destinationEmail);

			return paymentInfo;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	convertAmountToInteger(amount){
		return Math.round(amount * 100);
	}

	calculateAmountAfterFees(amount){
		const percentageFees = 0.056; //Percentage
		const paymentPlatformPercentageFees = 0.029; //Percentage
		const paymentPlatformExtraFees = 0.5; //Cents

		const calculatedFees = (amount * (percentageFees + paymentPlatformPercentageFees)) + paymentPlatformExtraFees;
		const amountAfterFees = (amount - calculatedFees) * 100;

		return Math.trunc(amountAfterFees);
	}

	async capturePayment(sessionDetails){
		try {
			const response = this.paymentCapture.capturePaymentWithSessionID(sessionDetails.sessionID)
			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = Payments;
