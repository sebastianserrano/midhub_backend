'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const PaymentsUserCreator = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/SignUp/PaymentsUserCreator.js');

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env-stripe' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

describe('Payment User', () => {
	describe('Upon creation', () => {
		it('Should Return An Object With Customer And Connect Keys\' Respective Info', async () => {
			const email = 'realaccount4@gmail.com'
			const country = "CA"
			const ip = "82.102.27.251"
			const firstName = "Juan"
			const lastName = "Serrano"

			const user = new PaymentsUserCreator(Stripe);
			const account = await user.create(email, country, ip, firstName, lastName);

			expect(account).to.be.an('object').that.has.all.keys('customer', 'connect');

			expect(account.customer).to.be.an('object').that.has.all.keys('ID');

			expect(account.connect).to.be.an('object').that.has.all.keys('ID');
		}).timeout(timeout + 5000)
	}),

	describe('Create Customer Account', () => {
		xit('Should Return The Customer ID', async () => {
			const email = 'testcustomer@gmail.com'

			const user = new PaymentsUserCreator(Stripe, email);
			const account = await user.createCustomerAccount();

			expect(account).to.be.an('object').that.has.all.keys('id');
		}).timeout(timeout + 5000)
	}),

	describe('Create Connect Account', () => {
		xit('Should Return The Main ID With Its Respective Public And Private Keys', async () => {
			const email = 'testcustomerss@gmail.com'

			const user = new PaymentsUserCreator(Stripe, email);
			const account  = await user.createConnectAccount();

			expect(account).to.be.an('object').that.has.all.keys('id');
		}).timeout(timeout + 5000);
	})
})
