'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const SuccessfulPayoutHandler = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Webhooks/Payout/SuccessfulPayoutHandler/SuccessfulPayoutHandler.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Successful Payout Handler', () => {
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
	describe('Handle Payout With ID', () => {
		it('Should Return True Upon Success', async () => {
			const payoutPlatformID = "po_1EBQtwLIIoPhKUjRPXrWsc5O"

			const successfulPayoutHandler = new SuccessfulPayoutHandler(databaseConnection);
			const response = await successfulPayoutHandler.handlePayoutWithID(payoutPlatformID)

			expect(response).to.be.true;
		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
