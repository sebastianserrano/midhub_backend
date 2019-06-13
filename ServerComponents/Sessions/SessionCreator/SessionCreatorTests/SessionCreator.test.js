'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const TestTokens = require('./TestTokens.js');
const SessionCreator = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/SessionCreator/SessionCreator.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Session Creator', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('With File', () => {
		xit('Should Return True Upon Succesful Save', async () => {
			const body = {
				session: {
					name: "File Uploaded Session"
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
			const sessions = new SessionCreator(Global);
			const response = await sessions.createSessionWithFile(body);

			expect(response).to.be.true;
		}).timeout(timeout);
	}),

	describe('With Funds', () => {
		describe('Charge Card', () => {
			xit('Should Return True Upon Succesful Save', async () => {
				const routes = ["sessions", "create_session", "load_funds", "charge_card"]
				const body = {
					paymentDetails: {
					 amount : 160.75,
					 currency : 'cad',
					 source : TestTokens["Visa"],
					 destinationEmail : "american_citizen@gmail.com"
					},
					sessionDetails: {
						session: {
							name: "Card Charged Session"
						},
						users: {
							sessionCreator: "american_citizen@gmail.com",
							sessionParticipant: "canadian_citizen@gmail.com"
						}
					}
				}
				const sessions = new SessionCreator(Global);
				const response = await sessions.createSessionWithFunds(routes, body);
				console.log(response)

				expect(response).to.be.true;
			}).timeout(timeout);
		}),

		describe('Charge Saved Card', () => {
			xit('Should Return True Upon Succesful Save', async () => {
				const routes = ["sessions", "create_session", "load_funds", "charge_saved_card"]
				const body = {
					paymentDetails: {
					 amount : 12.00,
					 currency : 'cad',
					 customerEmail : "american_citizen@gmail.com",
					 source : "card_1EN7JgIuaqSbzEWEgKpnJzvW",
					 destinationEmail : "canadian_citizen@gmail.com"
					},
					sessionDetails: {
						session: {
							name: "Saved Card Session"
						},
						users: {
							sessionCreator: "american_citizen@gmail.com",
							sessionParticipant: "canadian_citizen@gmail.com"
						}
					}
				}
				const sessions = new SessionCreator(Global);
				const response = await sessions.createSessionWithFunds(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		}),

		describe('Charge And Save Card', () => {
			it('Should Return True Upon Succesful Save', async () => {
				const routes = ["sessions", "create_session", "load_funds", "charge_save_card"]
				const body = {
					paymentDetails: {
					 amount : 15.75,
					 currency : 'cad',
					 source : TestTokens["Visa"],
					 destinationEmail : "canadian_citizen@gmail.com",
					 card: TestTokens["Visa"]
					},
					sessionDetails: {
						session: {
							name: "Save And Charge Session"
						},
						users: {
							sessionCreator: "american_citizen@gmail.com",
							sessionParticipant: "canadian_citizen@gmail.com"
						}
					}
				}
				const sessions = new SessionCreator(Global);
				const response = await sessions.createSessionWithFunds(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		})
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
