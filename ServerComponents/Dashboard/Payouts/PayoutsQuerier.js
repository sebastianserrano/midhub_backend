'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class PayoutsQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryPayouts(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Payouts', async task => {
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

		var settlementDate = payoutInfo["Payout Settlement Date"]
		var settlementDateFormatted;

		if(settlementDate !== null){
			settlementDate = settlementDate.toString();	
		 	settlementDateFormatted = settlementDate.substring(0,24)
		} else {
		 	settlementDateFormatted = ""
		}

		payoutInfo["Payout Initiation Date"] = initiationDateFormatted
		payoutInfo["Payout Settlement Date"] = settlementDateFormatted

		const response = {
			...payoutInfo
		}

		return response
	}

	fromUsers(task, email){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromPayouts(task, userID){
		return task.any('SELECT "Payout ID", "Payout Initiation Date", "Payout Settlement Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Last Four Digits" FROM "Payouts" WHERE ("User ID" = $1) AND (("Payout Status" = $2) OR ("Payout Status" = $3))', [userID, "Successful", "Unsuccessful"]);
	}
}

module.exports = PayoutsQuerier;
