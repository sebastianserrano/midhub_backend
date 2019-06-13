'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const AvailableSessionsQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Sessions/AvailableSessionsQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Available Sessions Querier', () => {
	before(async () => {
		const databaseCredentials = {
					host: 'localhost',
					port: 5432,
					database: 'midhub',
					user: 'user',
					password: 'user',
		};
		const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
		databaseConnection = await databaseConnectionManager.establishDatabaseConnection();
	});

	describe('Query Sessions', () => {
		it('Should Return An Array With The Sessions Information', async () => {
		  const email = 'example@gmail.com';
			const sessionsQuerier = new AvailableSessionsQuerier(databaseConnection);
			const response = await sessionsQuerier.querySessions(email);

			if(response.length > 0){
				const example = response[0];
				expect(example).to.have.keys("sessionCreator", "sessionAmount", "sessionCurrency", "sessionID", "sessionName", "withUser", "withUserEmail", "fundsLoaded", "fileUploaded", "fileName");
			}

		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
