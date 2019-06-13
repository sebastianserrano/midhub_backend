'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const DatabaseUserCreator = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/SignUp/DatabaseUserCreator.js');
const CreateRandomUUID = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Utilities/PasswordCreator.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Database User', () => {
	before(async () => {
		const databaseCredentials = {
					host: 'localhost',
					port: 5432,
					database: 'midhub',
					user: 'user',
					password: 'user',
		};
		const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
		databaseConnection = await databaseConnectionManager.establishDatabaseConnection();
	});
	describe('Upon Creation', () => {
		it('Should Return True Upon Success', async () => {
			const uuidGenerator = new CreateRandomUUID();
			const randomUUID = uuidGenerator.create('random password for it to work', 'sha512');

			const emailPartOne = randomUUID.Hash.substring(0,5);
			const emailPartTwo = '@gmail.com';
			const email = emailPartOne + emailPartTwo;

			const userCredentials = {
				firstName: "Juanes",
				middleName: "Sebastian",
				lastName: "Serrano",
				email: email,
				password: "my password longer than 12 characters",
				country: "CA"
			}

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

			const user = new DatabaseUserCreator(databaseConnection);
			const response = await user.create(userCredentials, userPaymentCredentials);
			expect(response).to.be.true;

		}).timeout(timeout);
	})
	after(function() {
		databaseConnection.$pool.end();
	})
})
