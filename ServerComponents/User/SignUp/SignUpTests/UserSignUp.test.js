'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const UserSignUp = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/SignUp/UserSignUp.js');
const CreateRandomUUID = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Utilities/PasswordCreator.js');

var Global;
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

const uuid = require('uuid/v4');

describe('UserSignUp', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Create', () => {
		it('Should Return True Upon Success', async () => {
			const emailPartOne = uuid().substring(0,5);
			const emailPartTwo = '@gmail.com';
			const email = emailPartOne + emailPartTwo;

			const firstName = 'finalName';
			const middleName = 'testname';
			const lastName = 'testlastname';
			const password = 'mytestpassword';
			const country = 'CA';
			const ip = '82.102.27.251';

			const signup = new UserSignUp(Global);
			const response = await signup.create(firstName, middleName, lastName, email, password,country, ip);
			expect(response).to.be.true;
		}).timeout(timeout + 10000);
	}),

	describe('in Database', () => {
		xit('Should Return True Upon Success', async () => {
			const uuidGenerator = new CreateRandomUUID();
			const randomUUID = uuidGenerator.create('random password for it to work', 'sha512');

			const emailPartOne = randomUUID.Hash.substring(0,5);
			const emailPartTwo = '@gmail.com';
			const email = emailPartOne + emailPartTwo;

			const firstName = 'testname';
			const middleName = 'testname';
			const lastName = 'testlastname';
			const password = 'mytestpassword';

			const customerID = "cus_" + randomUUID.Hash.substring(0,14);
			const connectID = "acct_" + randomUUID.Hash.substring(0,16);

			const userPaymentCredentials = {
				customer: {
						ID: customerID
					},
				connect: {
					ID: connectID
				}
			}

			const signup = new UserSignUp(Global, firstName, middleName, lastName, email, password);
			const response = await signup.inDatabase(userPaymentCredentials);

			expect(response).to.be.true;
		}).timeout(timeout);
	}),

	describe('In Payment Platform', () => {
		xit('Should Return An Object With Customer And Connect Keys\' Respective Info', async () => {
			const firstName = 'testname';
			const middleName = 'testname';
			const lastName = 'testlastname';
			const email = 'mytestemai@gmail.com';
			const password = 'mytestpassword';

			const signup = new UserSignUp(Global);
			const account = await signup.inPaymentPlatform()

			expect(account).to.be.an('object').that.has.all.keys('customer', 'connect');
		}).timeout(timeout + 5000)
	})
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
