'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class PaymentCardsQuerier {
	constructor(database, paymentPlatform){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryCards(userEmail){
		return new Promise((resolve, reject) => {
			this.database.task('Query Card Details', async task => {
				const userID = await this.fromUsers(task, userEmail)
				const customerID = await this.fromUserPaymentKeys(task, userID["User ID"])
				const cards = await this.fromPaymentPlatform(customerID["User Payment Customer ID"])
				const response = this.responseBuilder(cards.data);

				return response;
			}).then(cards => {
				resolve(cards);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	responseBuilder(cardsResponse){
		const cards = [];
		cardsResponse.forEach(card => {
			var cardResponse = {
				id: card.id,
				brand: card.brand,
				country: card.country,
				exp_year: card.exp_year,
				type: card.funding,
				last4: card.last4
			}
			cards.push(cardResponse)
		})

		return cards;
	}

	fromUsers(task, userEmail){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [userEmail]);
	}

	fromUserPaymentKeys(task, userID){
		return task.one('SELECT "User Payment Customer ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}

	fromPaymentPlatform(customerID){
		return this.paymentPlatform.customers.listCards(customerID);
	}
}

module.exports = PaymentCardsQuerier;
