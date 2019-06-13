'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const TestTokens = require('./TestTokens.js');
const SessionUpdater = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionUpdater/SessionUpdater.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Session Updater', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('With File', () => {
		xit('Should Return True Upon Succesful Update', async () => {
			const body = {
				sessionID: "566c7ba8-37ab-11e9-bef7-c73937372db4",
				file: {
					name: "check-config.sh",
					link: "https://www.dropbox.com/s/ndx5bnzibdqdyvh/check-config.sh?dl=0"
				}
			}
			const sessionUpdater = new SessionUpdater(Global);
			const response = await sessionUpdater.updateSessionWithFile(body);

			expect(response).to.be.true;
		}).timeout(timeout);
	})

	describe('With Funds', () => {
		describe('Charge Card', () => {
			xit('Should Return True Upon Succesful Update', async () => {
				const routes = ["sessions", "update_session", "load_funds", "charge_card"]
				const body = {
					paymentDetails: {
					 amount : 150.75,
					 currency : 'cad',
					 source : TestTokens["Visa"],
					 destinationEmail : "example@gmail.com"
					},
					sessionDetails: {
						sessionID: "e8e820ee-388d-11e9-8c89-1f6fe846b4be",
						users: {
							sessionCreator: "example@gmail.com",
							sessionParticipant: "juanca@gmail.com"
						}
					}
				}
				const sessionUpdater = new SessionUpdater(Global);
				const response = await sessionUpdater.updateSessionWithFunds(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		}),

		describe('Charge Saved Card', () => {
			xit('Should Return True Upon Succesful Update', async () => {
				const routes = ["sessions", "update_session", "load_funds", "charge_saved_card"]
				const body = {
					paymentDetails: {
					 amount : 12.00,
					 currency : 'cad',
					 customerEmail : "example@gmail.com",
					 source : "card_1E55GFIuaqSbzEWEvosO7jRq",
					 destinationEmail : "juanca@gmail.com"
					},
					sessionDetails: {
						sessionID: "e9795c76-388d-11e9-8c89-cb1536aabb28",
						users: {
							sessionCreator: "example@gmail.com",
							sessionParticipant: "juanca@gmail.com"
						}
					}
				}
				const sessionUpdater = new SessionUpdater(Global);
				const response = await sessionUpdater.updateSessionWithFunds(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		}),

		describe('Charge And Save Card', () => {
			xit('Should Return True Upon Succesful Update', async () => {
				const routes = ["sessions", "update_session", "load_funds", "charge_save_card"]
				const body = {
					paymentDetails: {
					 amount : 50.75,
					 currency : 'cad',
					 source : TestTokens["Mastercard Debit"],
					 destinationEmail : "example@gmail.com",
					 card: TestTokens["Mastercard Debit"]
					},
					sessionDetails: {
						sessionID: "ea021c3c-388d-11e9-8c89-d70f2c62d419",
						users: {
							sessionCreator: "example@gmail.com",
							sessionParticipant: "juanca@gmail.com"
						}
					}
				}
				const sessionUpdater = new SessionUpdater(Global);
				const response = await sessionUpdater.updateSessionWithFunds(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		})
	})

	describe('Update Session Unavailable', () => {
		xit('Should Return True Upon Succesful Update', async () => {
			const body = {
				sessionDetails: {
					sessionID: "2ede002c-3ad3-11e9-bf33-733a418c8be0"
				}
			}
			const sessionUpdater = new SessionUpdater(Global);
			const response = await sessionUpdater.updateSessionUnavailable(body);

			expect(response).to.be.true;

		}).timeout(timeout);
	})

	describe('Update Session Capture Payment', () => {
		it('Should Return True Upon Succesful Update', async () => {
			const body = {
				sessionDetails: {
					sessionID: "9d8c0dc6-3ae1-11e9-bf33-4fd352c92b28"
				}
			}
			const sessionUpdater = new SessionUpdater(Global);
			const response = await sessionUpdater.updateSessionCapturePayment(body);

			expect(response).to.be.true;

		}).timeout(timeout);
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
