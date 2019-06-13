'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');
const TestTokens = require('./TestTokens.js');

const Payments = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payments/Payments.js');

var Global;

describe('Payments', () => {
	before(async () => {
		Global = await new Global_();
	}),

	describe('Charge Card', () => {
		xit('Should Return Payment ID Upon Success', async () => {
			const body = {
			 amount : 15.00,
			 currency : 'cad',
			 source : TestTokens["Visa"],
			 destinationEmail : "example@gmail.com"
			}

			const payments = new Payments(Global);
			const response = await payments.chargeCard(body)

			expect(response).to.have.property("status", "Successful");
		}).timeout(5000);
	}),

	describe('Charge Saved Card', () => {
		xit('Should Return Payment ID Upon Success', async () => {
			const body = {
			 amount : 12.00,
			 currency : 'cad',
			 customerEmail : "example@gmail.com",
			 source : "card_1E55GFIuaqSbzEWEvosO7jRq",
			 destinationEmail : "juanca@gmail.com"
			}

			const payments = new Payments(Global);
			const response = await payments.chargeSavedCard(body)

			expect(response).to.have.property("status", "Successful");
		}).timeout(5000);
	})

	describe('Capture Payment', () => {
		it('Should Return True Upon Success', async () => {
			const body = {
		 	 sessionID : "0b91698c-3af2-11e9-bf33-63300f3d2ecc"
			}

			const payments = new Payments(Global);
			const response = await payments.capturePayment(body)

			expect(response).to.be.true;
		}).timeout(5000);
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
