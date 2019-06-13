'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

describe('Database Connection Manager', () => {
	it('Should Return A New Database Connection Object Upon Completing Protocol And Checking Connection Status', async () => {
		const databaseCredentials = {
					host: 'db_host',
					port: 5432,
					database: 'ebdb',
					user: 'user',
					password: 'user',
					max: 32,
					min: 10,
					idleTimeoutMillis: 180000
		};

		const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
		const databaseConnection = await databaseConnectionManager.establishDatabaseConnection()

		const response = await databaseConnection.any('SELECT now()');
		expect(response).to.be.an('array');
	}).timeout(timeout)
})
