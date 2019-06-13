'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const CustomerAccountIDQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payments/PaymentCharge/CustomerAccountIDQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Customer Account Querier', () => {
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

	describe('Query Account', () => {
		it('Should Return An Object With The Account Information', async () => {
			const email = 'example@gmail.com';

			const customerAccountIDQuerier = new CustomerAccountIDQuerier(databaseConnection);
			const response = await customerAccountIDQuerier.queryCustomerAccount(email);

			expect(response).to.have.property("User Payment Customer ID");
		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
