'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class OutgoingPayoutsQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryPayouts(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Outgoing Payments', async task => {
				const response = [];
				const userPersonalInfo = await this.fromUsers(task, email);
				const payoutsInfo = await this.fromPayouts(task, userPersonalInfo["User ID"])
				for(let key in payoutsInfo){
					const responseObject = this.buildResponse(payoutsInfo[key])

					response.push(responseObject)
				}

				return response;
			}).then(sessionsInfo => {
				resolve(sessionsInfo);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	buildResponse(payoutInfo){
		const initiationDate = payoutInfo["Payout Initiation Date"].toString();
		const initiationDateFormatted = initiationDate.substring(0,24)

		const arrivalDate = payoutInfo["Payout Arrival Date"].toString();
		const arrivalDateFormatted = arrivalDate.substring(0,24)

		payoutInfo["Payout Initiation Date"] = initiationDateFormatted
		payoutInfo["Payout Arrival Date"] = arrivalDateFormatted

		const response = {
			...payoutInfo
		}

		return response
	}

	fromUsers(task, email){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromPayouts(task, userID){
		return task.any('SELECT "Payout ID", "Payout Initiation Date", "Payout Arrival Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Last Four Digits" FROM "Payouts" WHERE ("User ID" = $1 AND "Payout Status" = $2)', [userID, "In Transit"]);
	}

	fromPayoutTypes(task, payoutID){
		return task.one('SELECT "Payout Type", "Payout Type Last Four Digits" FROM "Payout Types" WHERE ("Payout ID" = $1)', [payoutID])	
	}
}

module.exports = OutgoingPayoutsQuerier;
