'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentCardSaver = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payments/PaymentCardSaver/PaymentCardSaver.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Payment Card Saver', () => {
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
	describe('Save', () => {
		it('Should Return True Upon Success', async () => {
			const userEmail = "example@gmail.com";
			const card = "tok_visa_debit";

			const paymentCardSaver = new PaymentCardSaver(databaseConnection, Stripe);
			const response = await paymentCardSaver.save(userEmail, card)

			expect(response).to.be.true;
		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
