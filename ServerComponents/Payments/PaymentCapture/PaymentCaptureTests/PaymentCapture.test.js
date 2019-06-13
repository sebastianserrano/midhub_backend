'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');
const PaymentCapture = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payments/PaymentCapture/PaymentCapture.js');

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
		const sessionID = "6a6b4e3a-3ddd-11e9-8370-c7be890c31eb";

		const paymentCapture = new PaymentCapture(Stripe, databaseConnection);
		const response = await paymentCapture.capturePaymentWithSessionID(sessionID);

		expect(response).to.be.true;
	}).timeout(5000);

	after(function() {
		databaseConnection.$pool.end();
	})
})
