'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const TestTokens = require('./TestTokens.js');
const Sessions = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Sessions/Sessions.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Sessions', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Create Session', () => {
		describe('File Uploaded', () => {
			xit('Should Return True Upon Succesful Save', async () => {
				const routes = ["sessions", "create_session", "file_uploaded"]
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
				const sessions = new Sessions(Global);
				const response = await sessions.createSession(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		}),

		describe('Load Funds', () => {
			describe('Charge Card', () => {
				xit('Should Return True Upon Succesful Save', async () => {
					const routes = ["sessions", "create_session", "load_funds", "charge_card"]
					const body = {
						paymentDetails: {
						 amount : 15.75,
						 currency : 'cad',
						 source : TestTokens["Visa"],
			 		   destinationEmail : "example@gmail.com"
						},
						sessionDetails: {
							session: {
								name: "Card Charged Session"
							},
							users: {
								sessionCreator: "example@gmail.com",
								sessionParticipant: "juanca@gmail.com"
							}
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.createSession(routes, body);

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
						 customerEmail : "example@gmail.com",
						 source : "card_1E55GFIuaqSbzEWEvosO7jRq",
						 destinationEmail : "juanca@gmail.com"
						},
						sessionDetails: {
							session: {
								name: "Saved Card Session"
							},
							users: {
								sessionCreator: "example@gmail.com",
								sessionParticipant: "juanca@gmail.com"
							}
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.createSession(routes, body);

					expect(response).to.be.true;
				}).timeout(timeout);
			}),

			describe('Charge And Save Card', () => {
				xit('Should Return True Upon Succesful Save', async () => {
					const routes = ["sessions", "create_session", "load_funds", "charge_save_card"]
					const body = {
						paymentDetails: {
						 amount : 15.75,
						 currency : 'cad',
						 source : TestTokens["Visa"],
			 		   destinationEmail : "example@gmail.com",
						 card: TestTokens["Visa"]
						},
						sessionDetails: {
							session: {
								name: "Save And Charge Session"
							},
							users: {
								sessionCreator: "example@gmail.com",
								sessionParticipant: "juanca@gmail.com"
							}
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.createSession(routes, body);

					expect(response).to.be.true;
				}).timeout(timeout);
			})
		})
	})

	describe('Update Session', () => {
		describe('With File', () => {
			xit('Should Return True Upon Succesful Update', async () => {
				const routes = ["sessions", "update_session", "file_uploaded"]
				const body = {
					sessionID: "94bbff28-37ab-11e9-bef7-133cfb83603a",
					file: {
						name: "check-config.sh",
						link: "https://www.dropbox.com/s/ndx5bnzibdqdyvh/check-config.sh?dl=0"
					}
				}
				const sessions = new Sessions(Global);
				const response = await sessions.updateSession(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		}),
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
							sessionID: "9ecd73a4-3894-11e9-8c89-271042eadc26",
							users: {
								sessionCreator: "example@gmail.com",
								sessionParticipant: "juanca@gmail.com"
							}
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.updateSession(routes, body);

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
							sessionID: "9fb44eb4-3894-11e9-8c89-c36d5ceeaee7",
							users: {
								sessionPaymentCreator: "example@gmail.com",
								sessionParticipant: "juanca@gmail.com"
							}
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.updateSession(routes, body);

					expect(response).to.be.true;
				}).timeout(timeout);
			})
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
							sessionID: "9f42b894-3894-11e9-8c89-53dd2992eefb",
							users: {
								sessionCreator: "example@gmail.com",
								sessionParticipant: "juanca@gmail.com"
							}
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.updateSession(routes, body);

					expect(response).to.be.true;
				}).timeout(timeout);
			}),
			describe('Update Session Unavailable', () => {
				xit('Should Return True Upon Succesful Update', async () => {
					const routes = ["sessions", "update_session", "session_unavailable"]
					const body = {
						sessionDetails: {
							sessionID: "9d8c0dc6-3ae1-11e9-bf33-4fd352c92b28"
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.updateSession(routes, body);

					expect(response).to.be.true;

				}).timeout(timeout);
			}),
			describe('Update Session Capture Payment', () => {
				it('Should Return True Upon Succesful Update', async () => {
					const routes = ["sessions", "update_session", "capture_payment"]
					const body = {
						sessionDetails: {
							sessionID: "4e3176ae-3883-11e9-8c89-9ff370daebad"
						}
					}
					const sessions = new Sessions(Global);
					const response = await sessions.updateSession(routes, body);

					expect(response).to.be.true;

				}).timeout(timeout);
			})
		})
	}),

	describe('User Email Checker', () => {
		describe('Check User Existance With Email', () => {
			it('Should Return True Upon Success', async () => {
				const body = {
					email : 'example@gmail.com'
				}
				const sessions = new Sessions(Global);
				const response = await sessions.checkUserWithEmail(body);

				expect(response).to.be.true;
			})
		})
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
