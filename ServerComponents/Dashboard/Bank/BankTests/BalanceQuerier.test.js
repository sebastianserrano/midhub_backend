
'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const BalanceQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Bank/BalanceQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Available Balance Querier', () => {
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
	describe('Query Balances', () => {
		it('Should Return An Object With The Available And Incoming Balance Information Upon Success', async () => {
			const userEmail = "example@gmail.com";
			const currency = "usd";

			const balanceQuerier = new BalanceQuerier(databaseConnection, Stripe);
			const response = await balanceQuerier.queryBalances(userEmail, currency)

			expect(response).to.have.keys("availableBalance", "incomingBalance");

		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
