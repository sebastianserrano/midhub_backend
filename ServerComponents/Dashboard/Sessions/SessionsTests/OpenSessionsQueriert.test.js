'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const OpenSessionsQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Sessions/OpenSessionsQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Open Sessions Querier', () => {
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
			const openSessionsQuerier = new OpenSessionsQuerier(databaseConnection);
			const response = await openSessionsQuerier.querySessions(email);

			if(response.length > 0){
				const example = response[0];
				expect(example).to.have.keys("sessionID", "sessionName", "withUser", "withUserEmail", "date", "duration", "amount", "currency", "capture", "fileName");
			}

		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
