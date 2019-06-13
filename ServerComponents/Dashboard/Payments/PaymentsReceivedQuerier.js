'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class PaymentsReceivedQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryPayments(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Payments Received', async task => {
				const response = [];
				const userPersonalInfo = await this.fromUsers(task, email);
				const paymentsReceivedInfo = await this.fromPaymentsReceived(task, userPersonalInfo["User ID"])

				for(let key in paymentsReceivedInfo){
					const paymentsInfo = await this.fromPayments(task, paymentsReceivedInfo[key]["Payment ID"])
					for(let paymentKey in paymentsInfo){
						const userIDCreator = await this.fromPaymentsReleased(task, paymentsInfo[paymentKey]["Payment ID"])
						const paymentCreatorInfo = await this.fromUsersPaymentCreator(task, userIDCreator["Payment Released Creator"])
						const responseObject = this.buildResponse(paymentsInfo[paymentKey], paymentCreatorInfo)
						response.push(responseObject)
					}
				}

				return response;

			}).then(paymentsReleasedInfo => {
				resolve(paymentsReleasedInfo);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	buildResponse(paymentInfo, paymentCreatorInfo){
		const initiationDate = paymentInfo["Payment Initiation Date"].toString();
		const initiationDateFormatted = initiationDate.substring(0,24)

		const settlementDate = paymentInfo["Payment Settlement Date"].toString();
		const settlementDateFormatted = settlementDate.substring(0,24)

		paymentInfo["Payment Initiation Date"] = initiationDateFormatted
		paymentInfo["Payment Settlement Date"] = settlementDateFormatted

		const paymentCreatorResponseInfo = this.buildPaymentCreatorInfo(paymentCreatorInfo)

		const response = {
			...paymentInfo,
			...paymentCreatorResponseInfo
		}

		return response
	}

	buildPaymentCreatorInfo(paymentCreatorInfo){
		const paymentCreatorInfoArray = this.generatePaymentCreatorInfoArray(paymentCreatorInfo)
		const email = paymentCreatorInfoArray.pop()
		const fullName = this.generateNameFromInfo(paymentCreatorInfoArray)

		return {
			by: fullName,
			email: email
		}
	}

	generatePaymentCreatorInfoArray(info){
		var index = 0;
		const fullNameArray = [];
		for(let key in info){
			fullNameArray[index] = info[key]
			index++;
		}
		return fullNameArray;
	}

	generateNameFromInfo(infoArray){
		var fullName;
		if(infoArray[1] === ''){
			infoArray.splice(1, 1)
			fullName = infoArray.join(' ')
		} else {
			fullName = infoArray.join(' ')
		}
		return fullName
	}

	fromUsers(task, email){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromPaymentsReceived(task, userID){
		return task.any('SELECT "Payment ID" FROM "Payments Received" WHERE ("Payment Received Beneficiary" = $1)', [userID]);
	}

	fromPayments(task, paymentID){
		return task.any('SELECT "Payment Initiation Date", "Payment Amount", "Payment Net Amount","Payment Currency", "Payment Status", "Payment Settlement Date", "Payment ID", "Payment Exchange Rate" FROM "Payments" WHERE ("Payment ID" = $1 AND "Payment Capture" = $2 AND "Payment Status" = $3)', [paymentID, true, "Successful"]);
	}

	fromPaymentsReleased(task, paymentID){
		return task.one('SELECT "Payment Released Creator" from "Payments Released" WHERE ("Payment ID" = $1)', [paymentID]);
	}

	fromUsersPaymentCreator(task, userID){
		return task.one('SELECT "First Name", "Middle Name", "Last Name", "Email" FROM "Users" WHERE ("User ID" = $1)', [userID]);
	}
}

module.exports = PaymentsReceivedQuerier;
