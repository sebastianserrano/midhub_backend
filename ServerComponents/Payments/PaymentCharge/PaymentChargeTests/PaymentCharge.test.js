'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const TestTokens = require('./TestTokens.js');

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');
const PaymentCharge = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payments/PaymentCharge/PaymentCharge.js');

var databaseConnection;


describe('Payment Charge', () => {
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
	describe('Charge Saved Card', () => {
		xit('Should Return Object With Status Property \'Successful\' And Payment Information Upon Success', async () => {
			const amount = 1000;
			const amountAfterFees = 900;
			const currency = 'cad';
			const customerEmail = "example@gmail.com"
			const source = "card_1E55GFIuaqSbzEWEvosO7jRq";
			const destinationEmail = "american@gmail.com"

			const paymentCharge = new PaymentCharge(Stripe, databaseConnection);
			const response = await paymentCharge.chargeSavedCard(amount, amountAfterFees, currency, customerEmail, source, destinationEmail)

			expect(response).to.have.property("status", "Successful");
		}).timeout(5000);
	}),

	describe('Charge Card', () => {
		it('Should Return Object With Status Property \'Successful\' And Payment Information Upon Success', async () => {
			const amount = 500000;
			const amountAfterFees = 480000;
			const currency = 'usd';
			const source = "tok_bypassPending";
			const destinationEmail = "american@gmail.com"

			const paymentCharge = new PaymentCharge(Stripe, databaseConnection);
			const response = await paymentCharge.chargeCard(amount, amountAfterFees, currency, source, destinationEmail)

			expect(response).to.have.property("status", "Successful");
		}).timeout(5000);
	})
	after(function() {
		databaseConnection.$pool.end();
	})
})
