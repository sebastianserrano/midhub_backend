'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const Twilio = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Twilio/Twilio.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;
const body = {
	identity : 'TestIdentity',
	room : 'TestRoom'
}

describe('Twilio', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Generate Video Token', () => {
		it('Should Return A Token Containing 432 Characters', async () => {
			const twilio = new Twilio(Global);
			const response = twilio.generateVideoToken(body);

			expect(String(response.token)).to.have.lengthOf(432);

		}).timeout(timeout);
	}),

	describe('Generate Chat Token', () => {
		it('Should Return A Token Containing 475 Characters', async () => {
			const twilio = new Twilio(Global);
			const response = twilio.generateChatToken(body);

			expect(String(response.token)).to.have.lengthOf(475);

		}).timeout(timeout);
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
