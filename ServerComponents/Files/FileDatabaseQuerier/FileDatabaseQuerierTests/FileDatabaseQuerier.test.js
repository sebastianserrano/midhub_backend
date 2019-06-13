'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

require('dotenv').config({ path: EnvironmentPath + '/src/BackEnd/.env' });
const FileDatabaseQuerier = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Files/FileDatabaseQuerier/FileDatabaseQuerier.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('File Database Querier', () => {
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
	describe('Retrieve File Link', () => {
		it('Should Return An Object With The Link Success', async () => {
			const sessionDetails = {
				sessionID: "e0d4fdd2-3ad1-11e9-bf33-7bac956e80d2"
			}

			const fileDatabaseQuerier = new FileDatabaseQuerier(databaseConnection);
			const response = await fileDatabaseQuerier.retrieveFileLink(sessionDetails)

			expect(response).to.have.all.keys("File Link")
		}).timeout(5000);
	}),
	after(function() {
		databaseConnection.$pool.end();
	})
})
