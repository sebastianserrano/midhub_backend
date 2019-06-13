'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

class SessionUserEmailChecker {
	constructor(global){
		this.databaseErrorHandler = new DatabaseErrorHandler();
		this.database = global.getDatabase()
	}

	checkEmail(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query User Email', async task => {
				const response = await this.fromUsers(task, email);
			}).then(() => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	fromUsers(task, email){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

}

module.exports = SessionUserEmailChecker;
