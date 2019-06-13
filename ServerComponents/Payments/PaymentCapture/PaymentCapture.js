'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');
const PaymentsErrorHandler = require('../../Error/ErrorHandler/PaymentsErrorHandler.js');
const Promise = require('bluebird');

class PaymentCapture {
	constructor(paymentPlatform, database){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.paymentsErrorHandler = new PaymentsErrorHandler();
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	capturePaymentWithSessionID(sessionID){
		return new Promise((resolve, reject) => {
			this.database.task('Capture Payment', async task => {
				const paymentInfo = await this.fromPayments(task, sessionID)
				const captureInfo = await this.capturePayment(paymentInfo["Payment Platform ID"])
				const transactionInfo = await this.retrieveTransactionInfo(captureInfo.transfer)

				const balanceTransactionID = captureInfo.balance_transaction;
				const paymentTransactionID = transactionInfo.destination_payment;

				const balanceInfo = await this.retrieveBalanceInfo(balanceTransactionID)

				const exchangeRate = balanceInfo.exchange_rate;
				const paymentPlatformFee = balanceInfo.fee / 100;

				const date = new Date().toISOString();
				await this.updatePayments(task, date, paymentTransactionID, exchangeRate, paymentPlatformFee, sessionID);

			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	fromPayments(task, sessionID){
		return task.one('SELECT "Payment Platform ID" FROM "Payments" WHERE("Session ID" = $1)', [sessionID])
	}

	capturePayment(paymentPlatformID){
		return this.paymentPlatform.charges.capture(paymentPlatformID);
	}

	retrieveTransactionInfo(transactionID){
		return this.paymentPlatform.transfers.retrieve(transactionID)
	}

	retrieveBalanceInfo(balanceTransactionID){
		return this.paymentPlatform.balance.retrieveTransaction(balanceTransactionID)
	}

	updatePayments(task, date, paymentTransactionID, exchangeRate, paymentPlatformFee, sessionID){
		return task.none('UPDATE "Payments" SET "Payment Capture" = $1, "Payment Settlement Date" = $2, "Payment Platform Payment ID" = $3, "Payment Exchange Rate" = $4, "Payment Platform Fee" = $5, "Payment Status" = $6 WHERE ("Session ID" = $7)', [true, date, paymentTransactionID, exchangeRate, paymentPlatformFee, "Successful", sessionID])
	}
}

module.exports = PaymentCapture;
