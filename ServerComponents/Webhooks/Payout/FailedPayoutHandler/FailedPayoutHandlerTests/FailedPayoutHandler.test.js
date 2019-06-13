'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const FailedPayoutHandler = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Webhooks/Payout/FailedPayoutHandler/FailedPayoutHandler.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Failed Payout Handler', () => {
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
			const payoutPlatformID = "po_1EBQt7LIIoPhKUjRdeY8cgjD"

			const chargeExpiredHandler = new FailedPayoutHandler(databaseConnection);
			const response = await chargeExpiredHandler.handlePayoutWithID(payoutPlatformID)

			expect(response).to.be.true;
		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
