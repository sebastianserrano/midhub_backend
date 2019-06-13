'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class FileUploadedDatabaseSaver {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	save(sessionDetails){
		return new Promise((resolve, reject) => {
			this.database.tx('Save File Details', async transaction => {
				const sessionID = await this.inSessions(transaction, sessionDetails)
				const inFiles = await this.inFiles(transaction, sessionDetails.file, sessionID["Session ID"])
				const inSessionUsers = await this.saveInSessionUsers(transaction, sessionDetails.users, sessionID["Session ID"])

			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	inSessions(transaction, sessionDetails){
		return transaction.one('INSERT INTO "Sessions"("Session Name", "Session Creator", "File Uploaded", "Available") \
													  VALUES ($1, $2, $3, $4) RETURNING "Session ID"',
																  [sessionDetails.session.name, sessionDetails.users.sessionCreator, 'true', 'true']);
	}

	inFiles(transaction, fileDetails, sessionID){
		return transaction.none('INSERT INTO "Files"("File Name", "File Link", "Session ID") \
													  VALUES ($1, $2, $3)',
													  [fileDetails.name, fileDetails.link, sessionID]);
	}

	async saveInSessionUsers(transaction, users, sessionID){
		const userEmails = Object.values(users);
		const userIDS = await this.userIDSfromUsers(transaction, userEmails)
		const userIDSTransformedIntoArray = this.transformUserIDS(userIDS);
		const inSessionUsers = await this.inSessionUsers(transaction, sessionID, userIDSTransformedIntoArray)
	}

	userIDSfromUsers(transaction, emails){
		return transaction.any('SELECT "User ID" FROM "Users" WHERE ("Email" = $1) UNION SELECT "User ID" FROM "Users" WHERE ("Email" = $2)', [emails[0], emails[1]]);
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

module.exports = FileUploadedDatabaseSaver;
