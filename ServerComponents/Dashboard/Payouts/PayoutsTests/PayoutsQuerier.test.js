'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const PayoutsQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Payouts/PayoutsQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;
var email;

describe('Sessions Querier', () => {
	before(async () => {
		const databaseCredentials = {
					host: 'localhost',
					port: 5432,
					database: 'midhub',
					user: 'intel',
					password: 'intel',
		};
		const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
		databaseConnection = await databaseConnectionManager.establishDatabaseConnection();
		email = 'american@gmail.com';
	});

	describe('Query Payouts', () => {
		it('Should Return An Array With The Payouts Information', async () => {
			const payoutsQuerier = new PayoutsQuerier(databaseConnection);
			const response = await payoutsQuerier.queryPayouts(email);
			console.log(response)

			if(response.length >= 0){
				const example = response[0];
				expect(example).to.have.keys("Payout Initiation Date", "Payout Release Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Type", "Payout Type Last Four Digits", "Payout ID");
			}

		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
