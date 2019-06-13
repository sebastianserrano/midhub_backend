'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');
const Promise = require('bluebird');

class FundsLoadedDatabaseSaver {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	save(paymentDetails, sessionDetails){
		return new Promise((resolve, reject) => {
			this.database.tx('Save Funds Loaded Details', async transaction => {
				const sessionID = await this.inSessions(transaction, sessionDetails)
				const paymentID = await this.inPayments(transaction, paymentDetails, sessionID["Session ID"])
				const userIDS = await this.userIDSfromUsers(transaction, sessionDetails.users)
				const inPaymentsReleased = await this.inPaymentsReleased(transaction, paymentDetails, userIDS[0], paymentID["Payment ID"])
				const inPaymentsReceived = await this.inPaymentsReceived(transaction, userIDS[1], paymentID["Payment ID"])
				const inSessionUsers = await this.inSessionUsers(transaction, sessionID["Session ID"], userIDS)

				return;
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	inSessions(transaction, sessionDetails){
		return transaction.one('INSERT INTO "Sessions"("Session Name", "Session Creator", "Funds Loaded", "Available") \
													  VALUES ($1, $2, $3, $4) RETURNING "Session ID"',
																  [sessionDetails.session.name, sessionDetails.users.sessionCreator, 'true', 'true']);
	}

	inPayments(transaction, paymentDetails, sessionID){
		return transaction.one('INSERT INTO "Payments"("Payment Amount", "Payment Net Amount", "Payment Currency", "Payment Platform ID", "Session ID") \
													  VALUES ($1, $2, $3, $4, $5) RETURNING "Payment ID"',
													  [paymentDetails.amount, paymentDetails.netAmount, paymentDetails.currency, paymentDetails.paymentPlatformID, sessionID]);
	}

	inPaymentsReleased(transaction, paymentDetails, paymentCreatorID, paymentID){
		return transaction.none('INSERT INTO "Payments Released"("Payment Released Method", "Payment Released Corp Issuer", "Payment Released Last Four Digits", "Payment Released Creator", "Payment ID") \
													  VALUES ($1, $2, $3, $4, $5)',
													  [paymentDetails.method, paymentDetails.issuer, paymentDetails.lastFourDigits, paymentCreatorID, paymentID]);
	}

	inPaymentsReceived(transaction, paymentBeneficiary, paymentID){
		return transaction.none('INSERT INTO "Payments Received"("Payment Received Beneficiary", "Payment ID") \
													  VALUES ($1, $2)',
													  [paymentBeneficiary, paymentID]);
	}

	async userIDSfromUsers(transaction, users){
		const emails = Object.values(users);
		const userIDS = await transaction.any('select "User ID" from (select \'First\' as position, "User ID" from "Users" where ("Email" = $1) union select \'Second\' as position, "User ID" from "Users" where ("Email" = $2)) t order by case when position = \'First\' then 1 when position = \'Second\' then 2 end', [emails[0], emails[1]]);
		const userIDSTransformedIntoArray = this.transformUserIDS(userIDS);
		return userIDSTransformedIntoArray;
	}

	transformUserIDS(userIDS){
		const transformedUserIDS = []

		userIDS.forEach((userID) => {
			const rawUserID = Object.values(userID)
			transformedUserIDS.push(rawUserID[0])
		})

		return transformedUserIDS;
	}

	inSessionUsers(transaction, sessionID, userIDS){
		return transaction.any('INSERT INTO "Session Users"("Session ID", "User ID") SELECT $1 "User ID", X FROM UNNEST(ARRAY[$2]) X',
													  [sessionID, userIDS]);
	}
}

module.exports = FundsLoadedDatabaseSaver;
