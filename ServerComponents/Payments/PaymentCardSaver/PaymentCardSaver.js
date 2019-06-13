'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class PaymentCardSaver {
	constructor(database, paymentPlatform){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	save(userEmail, card){
		return new Promise((resolve, reject) => {
			this.database.task('Save Card Details', async task => {
				const userID = await this.fromUsers(task, userEmail)
				const customerID = await this.fromUserPaymentKeys(task, userID["User ID"])
				const numberOfSavedPaymentMethods = await this.currentNumberOfSavedPaymentMethods(customerID["User Payment Customer ID"])

				if(numberOfSavedPaymentMethods >= 3){
					throw new Error('Too many payment methods already saved')
				}

				const response = await this.inPaymentPlatform(card, customerID["User Payment Customer ID"])
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
        console.log(exception)
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	async currentNumberOfSavedPaymentMethods(customerID){
		const savedPaymentMethods = await this.paymentPlatform.customers.listCards(customerID)
		
		return savedPaymentMethods.data.length
	}

	fromUsers(task, userEmail){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [userEmail]);
	}

	fromUserPaymentKeys(task, userID){
		return task.one('SELECT "User Payment Customer ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}

	inPaymentPlatform(card, customerID){
		return this.paymentPlatform.customers.createSource(customerID, { source: card })
	}
}

module.exports = PaymentCardSaver;
