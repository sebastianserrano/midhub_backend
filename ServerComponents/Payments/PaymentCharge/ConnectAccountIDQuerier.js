'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class ConnectAccountIDQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryConnectAccount(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Connect Account', async task => {
				const userID = await this.fromUsers(task, email)
				const connectAccount = await this.fromUserPaymentConnectKeys(task, userID["User ID"])

				return connectAccount;
			}).then(connectAccount => {
				resolve(connectAccount);	
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
		return task.one('SELECT "User Payment Connect ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}
}

module.exports = ConnectAccountIDQuerier;
