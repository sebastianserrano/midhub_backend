'use strict';

const DatabaseErrorHandler = require('../../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class SuccessfulPayoutHandler {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	handlePayoutWithID(payoutPlatformID){
		return new Promise((resolve, reject) => {
			this.database.tx('Update Payouts', async transaction => {
				const today = new Date().toISOString();
				await this.updatePayouts(transaction, payoutPlatformID, today)

				return;
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	updatePayouts(transaction, payoutPlatformID, today){
		return transaction.none('UPDATE "Payouts" SET "Payout Status" = $1, "Payout Settlement Date" = $2 WHERE ("Payout Platform ID" = $3)', ["Successful", today, payoutPlatformID])	
	}
}

module.exports = SuccessfulPayoutHandler;
