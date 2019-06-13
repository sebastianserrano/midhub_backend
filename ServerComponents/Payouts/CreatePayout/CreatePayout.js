'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');
const PaymentsErrorHandler = require('../../Error/ErrorHandler/PaymentsErrorHandler.js');

const Promise = require('bluebird');

class CreatePayout {
	constructor(paymentPlatform, database){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.paymentsErrorHandler = new PaymentsErrorHandler();
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	create(email, destinationID, amount, currency, last4){
		return new Promise((resolve, reject) => {
			this.database.task('Create Payout', async task => {
				const userID = await this.fromUsers(task, email)
				const connectID = await this.fromUserPaymentKeys(task, userID["User ID"])

				const payoutAmount = amount * 100;
				const payoutResponse = await this.executePayout(connectID["User Payment Connect ID"], destinationID, payoutAmount, currency)

				const arrivalDate = new Date((payoutResponse.arrival_date) * 1000)
				const inPayouts = await this.inPayouts(task, amount, currency, userID["User ID"], payoutResponse.id, arrivalDate, last4)

				return;
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	fromUsers(task, userEmail){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [userEmail]);
	}

	fromUserPaymentKeys(task, userID){
		return task.one('SELECT "User Payment Connect ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}

	executePayout(accountID, destinationID, amount, currency){
		return this.paymentPlatform.payouts.create({
			amount: amount,
			currency: currency.toLowerCase(),
			destination: destinationID,
			source_type: "card",
			statement_descriptor: "Midhub"
		}, {stripe_account: accountID})
	}

	inPayouts(task, amount, currency, userID, platformID, arrivalDate, last4){
		return task.none('INSERT INTO "Payouts"("Payout Amount", "Payout Currency", "User ID", "Payout Platform ID", "Payout Arrival Date", "Payout Last Four Digits") VALUES ($1, $2, $3, $4, $5, $6)', [amount, currency, userID, platformID, arrivalDate, last4]);
	}
}

module.exports = CreatePayout;
