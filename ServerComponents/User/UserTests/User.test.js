'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const User = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/User.js');

const uuid = require('uuid/v4');

var Global;
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

describe('User', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Sign Up', () => {
		xit('Should Return True Upon Success', async () => {
			const emailPartOne = uuid().substring(0,5);
			const emailPartTwo = '@gmail.com';
			const email = emailPartOne + emailPartTwo;

			const firstName = 'finalName';
			const middleName = 'testname';
			const lastName = 'testlastname';
			const password = 'mytestpassword';
			const country = 'CA';
			const ip = '82.102.27.251';

			const user = new User(Global);
			const response = await user.signup(firstName, middleName, lastName, email, password, country, ip);

			expect(response).to.be.true;
		}).timeout(timeout + 20000);
	}),

	describe('Login', async () => {
		it('Should Return An Object With Email, Name, Country Code, Country Name, Country Currency, Token Upon Success', async () => {
			const email = 'guille@gmail.com';
			const password = 'clavedeguille'

			const user = new User(Global);
			const response = await user.login(email, password);

			expect(response).to.have.key('email', 'name', 'countryCode', 'countryName', 'countryCurrency', 'token');
		}).timeout(timeout + 5000);
	}),

	describe('Sign Out', () => {
		xit('Should be succesful only when user is already signed in', (done) => {
			const email = 'mytestemail@gmail.com';

			const user = new User();
			user.signout((error, response) => {
				expect(response).to.be.true;
				done()
			}).timeout(timeout);
		})
	})
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
