'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const UserSignupLimiter = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/UserSignupLimiter/UserSignupLimiter.js');

var Global;
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

describe('UserSignupLimiter', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Sign Up', () => {
		it('Should Return True Upon Success', async () => {
			const userSignupLimiter = new UserSignupLimiter(Global);
			const response = await userSignupLimiter.checkNumberOfCurrentUsers();

			expect(response).to.be.true;
		}).timeout(timeout + 20000);
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
