'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class FileDatabaseQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	retrieveFileLink(sessionDetails){
		return new Promise((resolve, reject) => {
			this.database.task('Retrieve File Link', async task => {
				const sessionID = sessionDetails.sessionID;
				const fileLink = await this.fromFiles(task, sessionID)

				return fileLink;
			}).then(fileLink => {
				resolve(fileLink);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	fromFiles(task, sessionID){
		return task.one('SELECT "File Link" FROM "Files" WHERE ("Session ID" = $1)', [sessionID]);
	}
}

module.exports = FileDatabaseQuerier;
