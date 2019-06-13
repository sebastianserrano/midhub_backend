'use strict';

const Promise = require('bluebird');

class DatabaseConnectionPoolManager{
	constructor(databaseConnectionManager){
		databaseConnectionManager.establishDatabaseConnection()
			.then(databaseConnection => {
				this.databaseConnection = databaseConnection
			}).catch(exception => {
				console.log(exception)
			})
	}
}

module.exports = DatabaseConnectionPoolManager;
