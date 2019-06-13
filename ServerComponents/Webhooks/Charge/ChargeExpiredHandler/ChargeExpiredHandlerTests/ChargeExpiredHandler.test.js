'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const ChargeExpiredHandler = require('/home/user/VirtualEnvironments/midhub_sandbox/src/BackEnd/ServerComponents/Webhooks/Charge/ChargeExpiredHandler/ChargeExpiredHandler.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Charge Expired Handler', () => {
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
	describe('Handle Charge With Payment ID', () => {
		it('Should Return True Upon Success', async () => {
			const paymentPlatformID = "ch_1ESFJxIuaqSbzEWEe1BYzFp4"

			const chargeExpiredHandler = new ChargeExpiredHandler(databaseConnection);
			const response = await chargeExpiredHandler.handleChargeWithPaymentID(paymentPlatformID)

			expect(response).to.be.true;
		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
