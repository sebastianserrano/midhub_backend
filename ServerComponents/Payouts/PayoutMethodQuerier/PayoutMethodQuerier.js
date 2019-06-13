'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class PayoutMethodQuerier {
	constructor(database, paymentPlatform){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryMethods(userEmail){
		return new Promise((resolve, reject) => {
			this.database.task('Save Card Details', async task => {
				const userID = await this.fromUsers(task, userEmail)
				const customerID = await this.fromUserPaymentKeys(task, userID["User ID"])
				const payoutOptions = await this.fromPaymentPlatform(customerID["User Payment Connect ID"])
				const response = this.responseBuilder(payoutOptions.data);

				return response;
			}).then(cards => {
				resolve(cards);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	responseBuilder(payoutsResponse){
		const cards = [];
		payoutsResponse.forEach(payout => {
			var payoutResponse = {
				last4: payout.last4,
				holderName: payout.account_holder_name,
				bankName: payout.bank_name,
				currency: payout.currency.toUpperCase(),
				id: payout.id
			}
			cards.push(payoutResponse)
		})

		return cards;
	}

	fromUsers(task, userEmail){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [userEmail]);
	}

	fromUserPaymentKeys(task, userID){
		return task.one('SELECT "User Payment Connect ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}

	fromPaymentPlatform(connectID){
		return this.paymentPlatform.accounts.listExternalAccounts(connectID, {object: "bank_account"})
	}
}

module.exports = PayoutMethodQuerier;
