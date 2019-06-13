'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class IncomingPaymentsQuerier {
	constructor(database, paymentPlatform){
		this.database = database;
		this.paymentPlatform = paymentPlatform;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryPayments(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Incoming Payments', async task => {
				const response = [];
				const userID = await this.fromUsers(task, email)
				const connectID = await this.fromUserPaymentKeys(task, userID["User ID"])

				const tenDaysFromNow = new Date().setDate(new Date().getDate() + 10)
				const incomingPayments = await this.fromPaymentPlatform(connectID["User Payment Connect ID"], tenDaysFromNow.toFixed(0))

				const pendingIncomingPayments = this.filterIncomingPayments(incomingPayments.data)

				for(let key in pendingIncomingPayments){
					const paymentsInfo = await this.fromPayments(task, pendingIncomingPayments[key].source)
					for(let paymentKey in paymentsInfo){
						const userIDCreator = await this.fromPaymentsReleased(task, paymentsInfo[paymentKey]["Payment ID"])
						const paymentCreatorInfo = await this.fromUsersPaymentCreator(task, userIDCreator["Payment Released Creator"])

						const paymentArrivalDate = pendingIncomingPayments[key].available_on * 1000
						const estimatedArrivalDate = new Date(paymentArrivalDate);
						paymentsInfo[paymentKey]["Payment Estimated Arrival Date"] = estimatedArrivalDate;

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
		const initiationDate = paymentInfo["Payment Settlement Date"].toString();
		const initiationDateFormatted = initiationDate.substring(0,24)
		paymentInfo["Payment Settlement Date"] = initiationDateFormatted

		const estimatedArrivalDate = paymentInfo["Payment Estimated Arrival Date"].toString();
		const estimatedArrivalDateFormatted = estimatedArrivalDate.substring(0,24)
		paymentInfo["Payment Estimated Arrival Date"] = estimatedArrivalDateFormatted

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

	fromUserPaymentKeys(task, userID){
		return task.one('SELECT "User Payment Connect ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}

	fromPaymentPlatform(connectID, tenDaysFromNow){
		return this.paymentPlatform.balance.listTransactions({type: "payment", available_on:{lte: tenDaysFromNow}}, {stripe_account: connectID})
	}

	filterIncomingPayments(payments){
		return payments.filter(payment => payment.status === "pending")
	}

	fromPayments(task, platformPaymentID){
		return task.any('SELECT "Payment ID", "Payment Settlement Date", "Payment Amount", "Payment Currency", "Payment Net Amount" FROM "Payments" WHERE ("Payment Platform Payment ID" = $1 and "Payment Capture" = $2 and "Payment Status" = $3)', [platformPaymentID, 'true', 'Successful']);
	}

	fromPaymentsReleased(task, paymentID){
		return task.one('SELECT "Payment Released Creator" from "Payments Released" WHERE ("Payment ID" = $1)', [paymentID]);
	}

	fromUsersPaymentCreator(task, userID){
		return task.one('SELECT "First Name", "Middle Name", "Last Name", "Email" FROM "Users" WHERE ("User ID" = $1)', [userID]);
	}
}

module.exports = IncomingPaymentsQuerier;
