'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const FileDatabaseUpdater = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionDatabaseUpdater/FileDatabaseUpdater.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Session Database File Updater', () => {
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

	describe('Update', () => {
		it('Should Return True Upon Succesful Update', async () => {
			const sessionDetails = {
				sessionID: "d0122944-379c-11e9-bef7-fb220269f560",
				file: {
					name: "check-config.sh",
					link: "https://www.dropbox.com/s/ndx5bnzibdqdyvh/check-config.sh?dl=0"
				}
			}
			const fileDatabaseUpdater = new FileDatabaseUpdater(databaseConnection);
			const response = await fileDatabaseUpdater.update(sessionDetails);

			expect(response).to.be.true;
		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
