'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const FileUploadedDatabaseSaver = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionDatabaseSaver/FileUploadedDatabaseSaver.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;

describe('Session File Uploaded Database Saver', () => {
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

	describe('Save', () => {
		it('Should Return True Upon Succesful Save', async () => {
			const sessionDetails = {
				session: {
					name: "My test session"
				},
				file: {
					name: "check-config.sh",
					link: "https://www.dropbox.com/s/ndx5bnzibdqdyvh/check-config.sh?dl=0"
				},
				users: {
					sessionCreator: "example@gmail.com",
					sessionParticipant: "juanca@gmail.com"
				}
			}
			const fileUploadedDatabaseSaver = new FileUploadedDatabaseSaver(databaseConnection);
			const response = await fileUploadedDatabaseSaver.save(sessionDetails);

			expect(response).to.be.true;
		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
