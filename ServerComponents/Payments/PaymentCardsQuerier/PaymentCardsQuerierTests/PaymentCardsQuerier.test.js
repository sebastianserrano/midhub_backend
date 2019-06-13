'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentCardsQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payments/PaymentCardsQuerier/PaymentCardsQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Payment Cards Querier', () => {
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
	describe('Query Cards', () => {
		it('Should Return An Object With The Card(s) Information Upon Success', async () => {
			const userEmail = "example@gmail.com";

			const paymentCardQuerier = new PaymentCardsQuerier(databaseConnection, Stripe);
			const response = await paymentCardQuerier.queryCards(userEmail)

			if(response.length >= 0){
				const example = response[0];
				expect(example).to.have.all.keys("id", "brand", "country", "exp_year", "type", "last4")
			}

		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
