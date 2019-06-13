'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');
const PaymentsErrorHandler = require('../../Error/ErrorHandler/PaymentsErrorHandler.js');
const Promise = require('bluebird');

class PayoutDatabaseSaver {
	constructor(paymentPlatform, database){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.paymentsErrorHandler = new PaymentsErrorHandler();
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	savePayout(email, bankToken){
		return new Promise((resolve, reject) => {
			this.database.task('Add Payout', async task => {
				const userInfo = await this.fromUsers(task, email);
				const userConnectInfo = await this.fromUserPaymentKeys(task, userInfo["User ID"]);
				const accounts = await this.paymentPlatform.accounts.listExternalAccounts(userConnectInfo["User Payment Connect ID"], {object: "bank_account"})
				if(accounts.data.length >= 2){
					throw new Error()
				}

				const response = await this.paymentPlatform.accounts.createExternalAccount(
				  							 userConnectInfo["User Payment Connect ID"],
												 { external_account: bankToken})
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	fromUsers(task, email){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromUserPaymentKeys(task, userID){
		return task.one('SELECT "User Payment Connect ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}
}

module.exports = PayoutDatabaseSaver;
