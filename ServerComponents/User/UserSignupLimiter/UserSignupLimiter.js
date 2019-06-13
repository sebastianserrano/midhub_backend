'use strict';

class UserSignupLimiter {
	constructor(Global){
		this.maxNumberOfUsers = 150;
		this.database = Global.getDatabase();
	}
	
	checkNumberOfCurrentUsers(){
		return new Promise((resolve, reject) => {
			this.database.task('Check Number Of Users', async task => {
				const results = await task.one('SELECT COUNT(*) FROM "Users"')
				const numberOfUsers = results.count;

				if(numberOfUsers >= this.maxNumberOfUsers){
					throw new Error('Reached limit number of users');
				}
			}).then(() => {
				resolve(true)	
			}).catch(exception => {
				reject(exception);
			})
		})
	}	
}

module.exports = UserSignupLimiter;
