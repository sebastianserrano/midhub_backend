'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

class UserExistanceChecker {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}
	
	checkEmail(email){
		return new Promise((resolve, reject) => {
			this.database.task('Insert New User', async task => {
				 const response = await task.one('SELECT EXISTS(SELECT 1 FROM "Users" WHERE "Email" = $1)', [email])
				if(response.exists){throw new Error('User already exists')}
			}).then(success => {
				resolve(true)	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}	
}

module.exports = UserExistanceChecker;
