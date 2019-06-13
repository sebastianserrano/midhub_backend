'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const UserLogin = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/Login/UserLogin.js');

var Global;
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

describe('User Login', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Login', () => {
		it('Should Return An Object With Email, Name, Country Code, Country Name, Country Currency, Token Upon Success', async () => {
			const email = 'guille@gmail.com';
			const password = 'clavedeguille'

			const login = new UserLogin(Global);
			const response = await login.checkCredentials(email, password);

			expect(response).to.have.key('email', 'name', 'countryCode', 'countryName', 'countryCurrency', 'token');
		}).timeout(timeout + 10000);
	})
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
