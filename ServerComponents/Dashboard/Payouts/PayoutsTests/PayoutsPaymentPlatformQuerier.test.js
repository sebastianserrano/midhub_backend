'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const PayoutsPaymentPlatformQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Payouts/PayoutsPaymentPlatformQuerier.js');

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env-stripe' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

describe('Payouts Payment Platform Querier', () => {
	describe('Upon retrieval', () => {
		it('Should Return An Object With Customer And Connect Keys\' Respective Info', async () => {
		  const email = 'example@gmail.com';

			const payoutsPaymentPlatformQuerier = new PayoutsPaymentPlatformQuerier(Stripe);
			const response = payoutsPaymentPlatformQuerier.queryPayouts(email)

			expect(response).to.be.an('object').that.has.all.keys('secret', 'publishable');
		}).timeout(timeout + 5000)
	})
})
