'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const SessionDatabaseUpdater = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionDatabaseUpdater/SessionDatabaseUpdater.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Session Database Updater', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('File Uploaded', () => {
		xit('Should Return True Upon Succesful Update', async () => {
			const body = {
				sessionID: "d0122944-379c-11e9-bef7-fb220269f560",
				file: {
					name: "check-config.sh",
					link: "https://www.dropbox.com/s/ndx5bnzibdqdyvh/check-config.sh?dl=0"
				}
			}
			const sessionDatabaseUpdater = new SessionDatabaseUpdater(Global);
			const response = await sessionDatabaseUpdater.updateWithFile(body);

			expect(response).to.be.true;

		}).timeout(timeout);
	}),

	describe('Funds Loaded', () => {
		xit('Should Return True Upon Succesful Update', async () => {
			const body = {
				sessionDetails: {
					sessionID: "4e3176ae-3883-11e9-8c89-9ff370daebad",
					users: {
						sessionCreator: "juancho_sss@hotmail.com",
						sessionParticipant: "juanca@gmail.com"
					}
				},
				paymentDetails: {
					amount: 105.50,
					currency: 'CAD',
					paymentPlatformID: 'ch_1E4iGEIuaqSbzEWEcL8CvhJq',
					method: 'debit',
					issuer: 'Visa',
					lastFourDigits: 1234
				}
			}
			const sessionDatabaseUpdater = new SessionDatabaseUpdater(Global);
			const response = await sessionDatabaseUpdater.updateWithFunds(body);

			expect(response).to.be.true;

		}).timeout(timeout);
	})

	describe('Update Session Unavailable', () => {
		it('Should Return True Upon Succesful Update', async () => {
			const body = {
				sessionDetails: {
					sessionID: "dc711ef2-3adf-11e9-bf33-a7d83a076ce6"
				}
			}
			const sessionDatabaseUpdater = new SessionDatabaseUpdater(Global);
			const response = await sessionDatabaseUpdater.updateSessionUnavailable(body);

			expect(response).to.be.true;

		}).timeout(timeout);
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
