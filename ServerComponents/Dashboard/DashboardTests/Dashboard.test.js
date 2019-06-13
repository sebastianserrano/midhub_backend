'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const Dashboard = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Dashboard.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;
var body;

describe('Dashboard', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Payouts', () => {
		it('Should Return An Array With The Payouts Information', async () => {
			const body = {
				email:  'example@gmail.com'
			}
			
			const dashboard = new Dashboard(Global);
			const response = await dashboard.payouts(body);

			if(response.length >= 0){
				const example = response[0];
				expect(example).to.have.keys("Payout Initiation Date", "Payout Release Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Type", "Payout Type Last Four Digits", "Payout ID");
			}
		})
	})

	describe('Payments', () => {
		describe('Released', () => {
			it('Should Return An Array With The Released Payments Information', async () => {
				const body = {
				  email:  'example@gmail.com'
				}
				const routes = ['dashboard', 'payments', 'released']
				
				const dashboard = new Dashboard(Global);
				const response = await dashboard.payments(routes, body);

				if(response.length >= 0){
					const example = response[0];
					expect(example).to.have.keys("Payment Initiation Date", "Payment Settlement Date", "Payment Amount", "Payment Currency", "Payment Status", "Payment ID", "to", "email");
				}

			})
		})

		describe('Received', () => {
			it('Should Return An Array With The Received Payments Information', async () => {
				const body = {
				  email:  'example@gmail.com'
				}
				const routes = ['dashboard', 'payments', 'received']
				
				const dashboard = new Dashboard(Global);
				const response = await dashboard.payments(routes, body);

				if(response.length >= 0){
					const example = response[0];
					expect(example).to.have.keys("Payment Initiation Date", "Payment Settlement Date", "Payment Amount", "Payment Currency", "Payment Status", "Payment ID", "User ID", "by", "email");
				}
			})
		})
	})

		describe('Profile', () => {
			describe('Retrieve', () => {
				it('Should Return An Object With Personal User Information Upon Success', async () => {
					const routes = ['dashboard', 'profile', 'retrieve']
					const body = {
				    email:  'example@gmail.com'
					}

					const dashboard = new Dashboard(Global);
					const response = await dashboard.profile(routes, body);

					expect(response).to.have.key('User ID', 'First Name', 'Middle Name', 'Last Name', 'Email', 'DOB', 'User Personal ID', 
																			 'Phone Number', 'User Street Name', 'User Street Number', 'User Apt Number', 'User City', 
																				'User State', 'User Country', 'User Zip Code');
				}).timeout(timeout + 10000);
			}),

			describe('Update', () => {
				it('Should Return \'Profile Successfully Updated\' Upon Success', async () => {
					const routes = ['dashboard', 'profile', 'update']
					const body = {
						DOB: '1960-05-24',
						UserPersonalID: '222-222',
						PhoneNumber: '+1 647 864 4749',
						Email: '0d799@gmail.com',
						StreetName: 'Cordova',
						StreetNumber: 90,
						AptNumber: 115,
						City: 'Tolima',
						State: 'Antioquia',
						Country: 'Colombia',
						Zip: 'M3C 3A3'
					}

					const dashboard = new Dashboard(Global);
					const response = await dashboard.profile(routes, body);

					expect(response).to.equal("Profile Successfully Updated");
				}).timeout(timeout + 10000);
			})
		})

		describe('Sessions', () => {
			describe('Open Sessions', () => {
				it('Should Return An Array With The Open Sessions Information', async () => {
					const routes = ["dashboard", "sessions", "retrieve", "open_sessions"]
					const body = {
				    email:  'example@gmail.com'
					}
					const dashboard = new Dashboard(Global);
					const response = await dashboard.sessions(routes, body);

					if(response.length > 0){
						const example = response[0];
						expect(example).to.have.keys("sessionID", "sessionName", "date", "duration", "amount", "withUser", "withUserEmail", "currency", "capture");
					}
				}).timeout(timeout);
			})
			describe('Closed Sessions', () => {
				it('Should Return An Array With The Closed Sessions Information', async () => {
					const routes = ["dashboard", "sessions", "retrieve", "closed_sessions"]
					const body = {
				    email:  'example@gmail.com'
					}
					const dashboard = new Dashboard(Global);
					const response = await dashboard.sessions(routes, body);

					if(response.length > 0){
						const example = response[0];
						expect(example).to.have.keys("sessionID", "sessionName", "date", "duration", "amount", "withUser", "withUserEmail", "currency", "capture");
					}
				}).timeout(timeout);
			})
		}),
		describe('Query Available Sessions', () => {
			it('Should Return An Array With The Sessions Information', async () => {
				const body = {
				  email:  'example@gmail.com'
				}
				const routes = ["dashboard", "sessions", "available_sessions"]
				
				const dashboard = new Dashboard(Global);
				const response = await dashboard.sessions(routes, body);

				if(response.length >= 0){
					const example = response[0];
					expect(example).to.have.keys("sessionCreator", "sessionAmount", "sessionCurrency", "sessionID", "sessionName", "withUser", "withUserEmail", "fundsLoaded", "fileUploaded");
				}
			})
		})

		describe('Bank', () => {
			describe('Incoming', () => {
				it('Should Return An Array With The Incoming Payments Information', async () => {
					const routes = ["dashboard", "bank", "incoming"]
					const body = {
				    email:  'example@gmail.com'
					}
					
					const dashboard = new Dashboard(Global);
					const response = await dashboard.bank(routes, body);

					if(response.length > 0){
						const example = response[0];
						expect(example).to.have.keys("Payment Capture Date", "Payment ID", "Payment Amount", "Payment Currency", "Payment Status", "by", "email");
					}
				}).timeout(timeout);
			}),

			describe('Outgoing', () => {
				it('Should Return An Array With The Outgoing Payouts Information', async () => {
					const routes = ["dashboard", "bank", "outgoing"]
					const body = {
				    email:  'example@gmail.com'
					}
					
					const dashboard = new Dashboard(Global);
					const response = await dashboard.bank(routes, body);

					if(response.length > 0){
						const example = response[0];
						expect(example).to.have.keys("Payout Initiation Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Type", "Payout Type Last Four Digits", "Payout ID");
					}
				}).timeout(timeout);
			})

			describe('Balances', () => {
				it('Should Return An Object With The Available And Incoming Balance Information Upon Success', async () => {
					const routes = ["dashboard", "bank", "balances"]
					const body = {
				    email:  'example@gmail.com',
						currency: 'usd'
					}
					
					const dashboard = new Dashboard(Global);
					const response = await dashboard.bank(routes, body);

					expect(response).to.have.keys("availableBalance", "incomingBalance");

				}).timeout(timeout);
			})
		})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})

