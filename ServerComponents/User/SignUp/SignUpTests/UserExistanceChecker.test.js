'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const UserExistanceChecker = require(EnvironmentPath + '/src/BackEnd/ServerComponents/User/SignUp/UserExistanceChecker.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Database User Existance Check', () => {
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
	it('Should Return True Upon Success', async () => {
		const email = "canadian@gmail.com";
		const userExistanceChecker = new UserExistanceChecker(databaseConnection);
		const response = await userExistanceChecker.checkEmail(email);
		expect(response).to.be.true;

	}).timeout(timeout);
	after(function() {
		databaseConnection.$pool.end();
	})
})
