'use strict';

const PaymentsErrorHandler = require('../../Error/ErrorHandler/PaymentsErrorHandler.js');

const Promise = require('bluebird');

class BalanceQuerier {
	constructor(database, paymentPlatform){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.paymentsErrorHandler = new PaymentsErrorHandler();
	}

	queryBalances(email, currency){
		return new Promise((resolve, reject) => {
			this.database.task('Query balances', async task => {
				const userID = await this.fromUsers(task, email)
				const connectID = await this.fromUserPaymentKeys(task, userID["User ID"])
				const accounts = await this.paymentPlatform.balance.retrieve({stripe_account: connectID["User Payment Connect ID"]})
				const availableBalance = this.retrieveBalance(accounts, "available", currency)
				const incomingBalance = this.retrieveBalance(accounts, "pending", currency)

				return {
					availableBalance: availableBalance,
					incomingBalance: incomingBalance
				}
			}).then(balances => {
				resolve(balances);	
			}).catch(exception => {
				const error = this.paymentsErrorHandler.detectError(exception);
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

	retrieveBalance(accounts, type, currency){
		const account = accounts[type].find(item => item.currency === currency)
		const balance = account.amount

		if(balance === 0){
			return balance
		} else {
			return parseFloat(balance / 100).toFixed(2)
		}
	}
}

module.exports = BalanceQuerier;
