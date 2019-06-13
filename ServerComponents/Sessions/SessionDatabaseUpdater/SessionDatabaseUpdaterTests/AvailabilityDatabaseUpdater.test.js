'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const AvailabilityDatabaseUpdater = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionDatabaseUpdater/AvailabilityDatabaseUpdater.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Session Database Availability Updater', () => {
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

	describe('Update Unavailable', () => {
		it('Should Return True Upon Succesful Update', async () => {
			const sessionDetails = {
				sessionID: "7902ff86-3ad3-11e9-bf33-2b1cfce571b8"
			}
			const availabilityDatabaseUpdater = new AvailabilityDatabaseUpdater(databaseConnection);
			const response = await availabilityDatabaseUpdater.updateUnavailable(sessionDetails);

			expect(response).to.be.true;
		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
