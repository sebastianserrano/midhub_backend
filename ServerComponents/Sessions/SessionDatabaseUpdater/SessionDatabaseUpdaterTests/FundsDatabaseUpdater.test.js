'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const FundsDatabaseUpdater = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionDatabaseUpdater/FundsDatabaseUpdater.js');
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Database/DatabaseConnectionManager.js');

var databaseConnection;
const sessionDetails = {
	sessionID: "9378bc96-37ab-11e9-bef7-772cbb8ede29",
	users: {
		sessionCreator: "juancho_sss@hotmail.com",
		sessionParticipant: "juanca@gmail.com"
	}
}

const paymentDetails = {
	amount: 15.50,
	currency: 'CAD',
	paymentPlatformID: 'ch_1E4iGEIuaqSbzEWEcL8CvhJa',
	method: 'credit',
	issuer: 'Visa',
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

	describe('Update', () => {
		it('Should Return True Upon Succesful Update', async () => {
			const fundsDatabaseUpdater = new FundsDatabaseUpdater(databaseConnection);
			const response = await fundsDatabaseUpdater.update(paymentDetails, sessionDetails);

			expect(response).to.be.true;

		}).timeout(timeout);
	})

	after(function() {
		databaseConnection.$pool.end();
	})
})
