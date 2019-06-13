'use strict';

const Promise = require('bluebird');

class DatabaseConnectionManager{
	constructor(databaseCredentials){
		this.databaseCredentials = databaseCredentials;
	}

	configureDatabaseInitialization(){
		const initOptions = {
					promiseLib: Promise,
		};
		const pgp = require('pg-promise')(initOptions);
		return pgp;
	}

	establishDatabaseConnection(){
		return new Promise((resolve, reject) => {
			try {
				const pgp = this.configureDatabaseInitialization();
				const databaseConnection = pgp(this.databaseCredentials);

				resolve(databaseConnection)
			} catch(exception){
				reject(exception)
			}
		})
	}
}

module.exports = DatabaseConnectionManager;
