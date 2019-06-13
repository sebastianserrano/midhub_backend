'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const IncomingPaymentsQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Bank/IncomingPaymentsQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Incoming Payments Querier', () => {
	before(async () => {
		const databaseCredentials = {
					host: 'localhost',
					port: 5432,
					database: 'midhub',
					user: 'user',
					password: 'user'
		};
		const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
		databaseConnection = await databaseConnectionManager.establishDatabaseConnection();
	});

	it('Should Return An Array With The Incoming Payments Information', async () => {
		const email = "example@gmail.com";
		const incomingPaymentsQuerier = new IncomingPaymentsQuerier(databaseConnection, Stripe);
		const response = await incomingPaymentsQuerier.queryPayments(email);

		if(response.length > 0){
			const example = response[0];
			expect(example).to.have.keys("Payment ID", "Payment Settlement Date", "Payment Estimated Arrival Date", "Payment Amount", "Payment Net Amount", "Payment Currency", "by", "email");
		}
	}).timeout(timeout);

	after(function() {
		databaseConnection.$pool.end();
	})
})
