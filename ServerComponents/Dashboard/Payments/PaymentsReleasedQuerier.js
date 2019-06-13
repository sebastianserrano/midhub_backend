'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class PaymentsReleasedQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryPayments(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Payments Released', async task => {
				const response = [];
				const userPersonalInfo = await this.fromUsers(task, email);
				const paymentsReleased = await this.fromPaymentsReleased(task, userPersonalInfo["User ID"])

				for(let paymentReleasedKey in paymentsReleased){
					const paymentInfo = await this.fromPayments(task, paymentsReleased[paymentReleasedKey]["Payment ID"])
					for(let paymentInfoKey in paymentInfo){
						const userIDBeneficiary = await this.fromPaymentsReceived(task, paymentInfo[paymentInfoKey]["Payment ID"])
						const beneficiaryInfo = await this.fromUsersBeneficiary(task, userIDBeneficiary["Payment Received Beneficiary"])
						const responseObject = this.buildResponse(paymentInfo[paymentInfoKey], beneficiaryInfo)
						response.push(responseObject)
					}
				}
			
				return response
			}).then(paymentsReleasedInfo => {
				resolve(paymentsReleasedInfo);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	buildResponse(paymentInfo, beneficiaryInfo){
		const initiationDate = paymentInfo["Payment Initiation Date"].toString();
		const initiationDateFormatted = initiationDate.substring(0,24)

		var settlementDate = paymentInfo["Payment Settlement Date"]
		var settlementDateFormatted;
		if(settlementDate === null){
			settlementDateFormatted = "To Be Confirmed"
		} else {
			settlementDateFormatted = settlementDate.toString().substring(0,24)
		}

		paymentInfo["Payment Initiation Date"] = initiationDateFormatted
		paymentInfo["Payment Settlement Date"] = settlementDateFormatted

		const beneficiaryResponseInfo = this.buildBeneficiaryInfo(beneficiaryInfo)

		const response = {
			...paymentInfo,
			...beneficiaryResponseInfo
		}

		return response
	}

	buildBeneficiaryInfo(beneficiaryInfo){
		const beneficiaryInfoArray = this.generateBeneficiaryInfoArray(beneficiaryInfo)
		const email = beneficiaryInfoArray.pop()
		const fullName = this.generateNameFromInfo(beneficiaryInfoArray)

		return {
			to: fullName,
			email: email
		}
	}

	generateBeneficiaryInfoArray(info){
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

	fromPaymentsReleased(task, userID){
		return task.any('SELECT "Payment ID" FROM "Payments Released" WHERE ("Payment Released Creator" = $1)', [userID]);
	}

	fromPayments(task, paymentID){
		return task.any('SELECT "Payment Initiation Date", "Payment Amount", "Payment Currency", "Payment Status", "Payment Settlement Date", "Payment ID" FROM "Payments" WHERE ("Payment ID" = $1 AND "Payment Capture" = $2)', [paymentID, true]);
	}

	fromPaymentsReceived(task, paymentID){
		return task.one('SELECT "Payment Received Beneficiary" from "Payments Received" WHERE ("Payment ID" = $1)', [paymentID]);
	}

	fromUsersBeneficiary(task, userID){
		return task.one('SELECT "First Name", "Middle Name", "Last Name", "Email" FROM "Users" WHERE ("User ID" = $1)', [userID]);
	}
}

module.exports = PaymentsReleasedQuerier;
