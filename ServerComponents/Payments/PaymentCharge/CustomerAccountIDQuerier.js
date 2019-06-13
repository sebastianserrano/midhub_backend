'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class CustomerConnectAccountQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryCustomerAccount(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Connect Account', async task => {
				const userID = await this.fromUsers(task, email)
				const customerAccount = await this.fromUserPaymentConnectKeys(task, userID["User ID"])

				return customerAccount;
			}).then(customerAccount => {
				resolve(customerAccount);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	fromUsers(task, email){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromUserPaymentConnectKeys(task, userID){
		return task.one('SELECT "User Payment Customer ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}
}

module.exports = CustomerConnectAccountQuerier;
