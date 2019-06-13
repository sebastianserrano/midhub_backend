'use strict';

const DatabaseErrorHandler = require('../../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class FailedPayoutHandler {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	handlePayoutWithID(payoutPlatformID){
		return new Promise((resolve, reject) => {
			this.database.tx('Update Payouts', async transaction => {
				await this.updatePayouts(transaction, payoutPlatformID)

				return;
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	updatePayouts(transaction, payoutPlatformID){
		return transaction.none('UPDATE "Payouts" SET "Payout Status" = $1 WHERE ("Payout Platform ID" = $2)', ["Unsuccessful", payoutPlatformID])	
	}
}

module.exports = FailedPayoutHandler;
