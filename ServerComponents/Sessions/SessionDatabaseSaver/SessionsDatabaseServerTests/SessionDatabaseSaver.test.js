'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const SessionDatabaseSaver = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionDatabaseSaver/SessionDatabaseSaver.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Session Database Saver', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('File Uploaded', () => {
		it('Should Return True Upon Succesful Save', async () => {
			const body = {
				session: {
					name: "My file loaded session"
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
			const sessionDatabaseSaver = new SessionDatabaseSaver(Global);
			const response = await sessionDatabaseSaver.fileUploaded(body);

			expect(response).to.be.true;

		}).timeout(timeout);
	}),

	describe('Funds Loaded', () => {
		it('Should Return True Upon Succesful Save', async () => {
			const body = {
				sessionDetails: {
					session: {
						name: "My funds loaded session"
					},
					users: {
						sessionCreator: "example@gmail.com",
						sessionParticipant: "juanca@gmail.com"
					}
				},
				paymentResponse: {
					amount: 15.50,
					currency: 'CAD',
					paymentPlatformID: 'ch_1E4iGEIuaqSbzEWEcL8CvhJq',
					method: 'debit',
					issuer: 'visa',
					lastFourDigits: 1234
				}
			}
			const sessionDatabaseSaver = new SessionDatabaseSaver(Global);
			const response = await sessionDatabaseSaver.fundsLoaded(body);

			expect(response).to.be.true;

		}).timeout(timeout);
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
