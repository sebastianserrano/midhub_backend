'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const SessionUserEmailChecker = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionUserEmailChecker/SessionUserEmailChecker.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Session User Email Checker', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Check User Existance With Email', () => {
		it('Should Return True Upon Success', async () => {
			const email = 'example@gmail.com'
			
			const sessionUserEmailChecker = new SessionUserEmailChecker(Global);
			const response = await sessionUserEmailChecker.checkEmail(email);

			expect(response).to.be.true;
		})
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})

