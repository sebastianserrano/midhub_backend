'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CreatePayout = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payouts/CreatePayout/CreatePayout.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Payment Capture', () => {
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

	it('Should Return True Upon Success', async () => {
		const email = "example@gmail.com"
		const destinationID = "ba_1EBDYGLIIoPhKUjRl1NkqXbQ";
		const amount = 10;
		const currency = 'CAD';
		const last4 = 6787

		const createPayout = new CreatePayout(Stripe, databaseConnection);
		const response = await createPayout.create(email, destinationID, amount, currency, last4);

		expect(response).to.be.true;
	}).timeout(5000);

	after(function() {
		databaseConnection.$pool.end();
	})
})
