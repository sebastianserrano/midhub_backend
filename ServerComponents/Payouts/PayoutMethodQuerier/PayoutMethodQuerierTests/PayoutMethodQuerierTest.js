'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PayoutMethodQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payouts/PayoutMethodQuerier/PayoutMethodQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Payout Method Querier', () => {
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
	});
	it('Should Return An Object With The Payout Method(s) Information Upon Success', async () => {
		const userEmail = "juancho_sss@hotmail.com";

		const payoutMethodQuerier = new PayoutMethodQuerier(databaseConnection, Stripe);
		const response = await payoutMethodQuerier.queryMethods(userEmail)

		if(response.length > 0){
			const example = response[0];
			console.log(example)
			expect(example).to.have.all.keys("last4", "holderName", "bankName", "currency")
		}

	}).timeout(5000);
	after(function() {
		databaseConnection.$pool.end();
	})
})
