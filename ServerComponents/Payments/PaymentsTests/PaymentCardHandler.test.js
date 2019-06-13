'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');
const PaymentCardHandler = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payments/PaymentCardHandler.js');

var Global;

describe('Payment Card Handler', () => {
	before(async () => {
		Global = await new Global_();
	}),
	describe('Save Card', () => {
		it('Should Return True Upon Success', async () => {
			const userEmail = "example@gmail.com";
			const card = "tok_visa_debit";

			const paymentCardHandler = new PaymentCardHandler(Global);
			const response = await paymentCardHandler.saveCard(userEmail, card)

			expect(response).to.be.true;
		}).timeout(5000);
	}),
	describe('Query Cards', () => {
		it('Should Return An Object With The Card(s) Information Upon Success', async () => {
			const userEmail = "example@gmail.com";

			const paymentCardHandler = new PaymentCardHandler(Global);
			const response = await paymentCardHandler.queryCards(userEmail)

			if(response.length >= 0){
				const example = response[0];
				expect(example).to.have.all.keys("id", "brand", "country", "exp_year", "type", "last4")
			}
		}).timeout(5000);
	}),
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
