'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');
const ProfileQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Profile/ProfileQuerier.js')

var databaseConnection;

describe('Dashboard Profile Querier', () => {
	before(async function() {
		const databaseCredentials = {
					host: 'localhost',
					port: 5432,
					database: 'midhub',
					user: 'user',
					password: 'user',
		};
		const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
		databaseConnection = await databaseConnectionManager.establishDatabaseConnection()
	}),
	it('Should Return An Object With Personal User Information Upon Success', async () => {
		const email = 'example@gmail.com';

		const user = new ProfileQuerier(databaseConnection);
		const response = await user.queryProfile(email);
		expect(response).to.have.key('User ID', 'First Name', 'Middle Name', 'Last Name', 'Email', 'DOB', 'User Personal ID', 
																	 'Phone Number', 'User Street Name', 'User Street Number', 'User Apt Number', 'User City', 
																		'User State', 'User Country', 'User Zip Code');

	}).timeout(timeout),
	after(function() {
		databaseConnection.$pool.end();
	})
})
