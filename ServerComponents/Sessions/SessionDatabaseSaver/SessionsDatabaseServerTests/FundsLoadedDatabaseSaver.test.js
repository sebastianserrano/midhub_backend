'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const FundsLoadedDatabaseSaver = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionDatabaseSaver/FundsLoadedDatabaseSaver.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;
const sessionDetails = {
	session: {
		name: "My test session"
	},
	users: {
		sessionCreator: "juanca@gmail.com",
		sessionParticipant: "example@gmail.com"
	}
}

const paymentDetails = {
	amount: 1200,
	currency: 'CAD',
	paymentPlatformID: 'ch_1E4iGEIuaqSbzEWEcL8CvhJq',
	method: 'debit',
	issuer: 'visa',
	lastFourDigits: 1234
}

describe('Funds Loaded Database Saver', () => {
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
			const fundsLoadedDatabaseSaver = new FundsLoadedDatabaseSaver(databaseConnection);
			const response = await fundsLoadedDatabaseSaver.save(paymentDetails, sessionDetails);

			expect(response).to.be.true;

		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
