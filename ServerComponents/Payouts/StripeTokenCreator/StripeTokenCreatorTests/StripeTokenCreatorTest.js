'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Plaid = require('stripe')(process.env.STRIPE_SECRET_KEY);
var plaid;
const StripeTokenCreator = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payouts/StripeTokenCreator/StripeTokenCreator.js');

describe('Payout Saver', () => {
	before(async () => {
		plaid = new Plaid.Client(
			process.env.PLAID_CLIENT_ID,
			process.env.PLAID_SECRET,
			process.env.PLAID_PUBLIC_KEY,
			Plaid.environments.sandbox,
			{version: '2018-05-22'}
		);
	});
	describe('Stripe Token Creator', () => {
		it('Should Return A Bank Token Upon Success', async () => {
			const plaidToken = {
				public_token: "",
				account_id: ""
			}

			const payoutDatabaseSaver = new StripeTokenCreator(plaid);
			const response = await payoutDatabaseSaver.savePayout(userEmail, plaidToken)

			expect(response).to.be.true;
		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
