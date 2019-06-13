'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const PaymentsReleasedQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Payments/PaymentsReleasedQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Payments Released Querier', () => {
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

	describe('Query Payments Released', () => {
		it('Should Return An Array With The Payments Released Information', async () => {
		  const email = 'example@gmail.com';
			const paymentsReleasedQuerier = new PaymentsReleasedQuerier(databaseConnection);
			const response = await paymentsReleasedQuerier.queryPayments(email);
			console.log(response)

			if(response.length > 0){
				const example = response[0];
				expect(example).to.have.keys("Payment Initiation Date", "Payment Settlement Date", "Payment Amount", "Payment Currency", "Payment Status", "Payment ID", "to", "email");
			}
		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
