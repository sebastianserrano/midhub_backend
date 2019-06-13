'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class FileDatabaseUpdater {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	update(sessionDetails){
		return new Promise((resolve, reject) => {
			this.database.tx('Update File Details', async transaction => {
				const inSessions = await this.inSessions(transaction, sessionDetails.sessionID)
				const inFiles = await this.inFiles(transaction, sessionDetails.file, sessionDetails.sessionID)
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	inSessions(transaction, sessionID){
		return transaction.none('UPDATE "Sessions" SET "File Uploaded" = $1 WHERE ("Session ID" = $2)', [true, sessionID])
	}

	inFiles(transaction, fileDetails, sessionID){
		return transaction.none('INSERT INTO "Files"("File Name", "File Link", "Session ID") \
													  VALUES ($1, $2, $3)',
													  [fileDetails.name, fileDetails.link, sessionID]);
	}

}

module.exports = FileDatabaseUpdater;
