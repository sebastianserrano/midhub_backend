'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const OutgoingPayoutsQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Bank/OutgoingPayoutsQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Outgoing Payouts Querier', () => {
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

	it('Should Return An Array With The Outgoing Payouts Information', async () => {
		const email = "example@gmail.com";
		const outgoingPayoutsQuerier = new OutgoingPayoutsQuerier(databaseConnection);
		const response = await outgoingPayoutsQuerier.queryPayouts(email);

		if(response.length > 0){
			const example = response[0];
			expect(example).to.have.keys("Payout Initiation Date", "Payout Arrival Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Last Four Digits", "Payout ID");
		}
	}).timeout(timeout);

	after(function() {
		databaseConnection.$pool.end();
	})
})
