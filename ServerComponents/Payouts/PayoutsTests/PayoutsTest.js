'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

const Payouts = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Payouts/Payouts.js');

var Global;

describe('Payouts', () => {
	before(async () => {
		Global = await new Global_();
	}),

	describe('Save Payout', () => {
		xit('Should Return True Upon Success', async () => {
			const body = {
			 email : "juancho_sss@hotmail.com",
			 bankToken : "btok_1EApqoIuaqSbzEWE57uam3s6",
			}

			const payouts = new Payouts(Global);
			const response = await payouts.savePayout(body)

			expect(response).to.be.true;
		}).timeout(5000);
	}),

	describe('Query Payout', () => {
		xit('Should Return True Upon Success', async () => {
			const body = {
			 email : "juancho_sss@hotmail.com",
			}

			const payouts = new Payouts(Global);
			const response = await payouts.retrievePayoutMethods(body)

			if(response.length > 0){
				const example = response[0];
				expect(example).to.have.all.keys("last4", "holderName", "bankName", "currency")
			}
		}).timeout(5000);
	})

	describe('Create Payout', () => {
		it('Should Return True Upon Success', async () => {
			const body = {
			 email : "juancho_sss@hotmail.com",
			 destinationID : "ba_1EBDYGLIIoPhKUjRl1NkqXbQ",
			 amount : 10,
			 currency : "CAD",
			 last4 : 7374
			}

			const payouts = new Payouts(Global);
			const response = await payouts.createPlatformPayout(body)

			expect(response).to.be.true;
		}).timeout(9000);
	})
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
