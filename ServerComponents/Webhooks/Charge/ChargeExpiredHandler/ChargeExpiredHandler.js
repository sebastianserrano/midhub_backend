'use strict';

const DatabaseErrorHandler = require('../../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class ChargeExpiredHandler {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	handleChargeWithPaymentID(paymentPlatformID){
		return new Promise((resolve, reject) => {
			this.database.tx('Query Payouts', async transaction => {
				await this.updatePayments(transaction, paymentPlatformID)
				const sessionID = await this.fromSessions(transaction, paymentPlatformID)
				await this.updateSessions(transaction, sessionID["Session ID"])

				return;
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	updatePayments(transaction, paymentPlatformID){
		return transaction.none('UPDATE "Payments" SET "Payment Status" = $1 WHERE ("Payment Platform ID" = $2)', ["Expired", paymentPlatformID])	
	}

	fromSessions(transaction, paymentPlatformID){
		return transaction.one('SELECT "Session ID" FROM "Payments" WHERE ("Payment Platform ID" = $1)', [paymentPlatformID])
	}

	updateSessions(transaction, sessionID){
		return transaction.none('UPDATE "Sessions" SET "Available" = $1 WHERE ("Session ID" = $2)', [false, sessionID])	
	}
}

module.exports = ChargeExpiredHandler;
