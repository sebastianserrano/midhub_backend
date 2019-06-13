'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const DatabaseLoginQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/Login/DatabaseLoginQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Database Login', () => {
	before(async () => {
		const databaseCredentials = {
					host: 'localhost',
					port: 5432,
					database: 'midhub',
					user: 'intel',
					password: 'intel',
		};
		const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
		databaseConnection = await databaseConnectionManager.establishDatabaseConnection();
	});
	describe('Credentials Retrieval', () => {
		it('Should Return An Object With Email, Name, Country Code, Country Name, Country Currency Upon Success', async () => {
			const email = 'guille@gmail.com';
			const password = 'clavedeguille'

			const user = new DatabaseLoginQuerier(databaseConnection);
			const response = await user.checkLoginCredentials(email, password);
			expect(response).to.have.key('email', 'name', 'countryCode', 'countryName', 'countryCurrency');

		}).timeout(timeout);
	})
	after(function() {
		databaseConnection.$pool.end();
	})
})
