'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class AvailabilityDatabaseUpdater {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	updateUnavailable(sessionDetails){
		return new Promise((resolve, reject) => {
			this.database.tx('Update Session Availability', async transaction => {
				const inSessions = await this.inSessions(transaction, sessionDetails.sessionID)
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	inSessions(transaction, sessionID){
		return transaction.none('UPDATE "Sessions" SET "Available" = $1 WHERE ("Session ID" = $2)', [false, sessionID])
	}
}

module.exports = AvailabilityDatabaseUpdater;
