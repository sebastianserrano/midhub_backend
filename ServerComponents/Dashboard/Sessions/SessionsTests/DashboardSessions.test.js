'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const DashboardSessions = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Sessions/DashboardSessions.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Dashboard Sessions', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Query Sessions', () => {
		describe('Query Open Sessions', () => {
			it('Should Return An Array With The Open Sessions Information', async () => {
		    const email = 'example@gmail.com';
				const routes = ["dashboard", "sessions", "retrieve", "open_sessions"]
				const dashboardSessions = new DashboardSessions(Global);
				const response = await dashboardSessions.querySessions(routes, email);

				if(response.length > 0){
					const example = response[0];
					expect(example).to.have.keys("sessionID", "sessionName", "date", "duration", "amount", "withUser", "withUserEmail", "currency", "capture");
				}
			}).timeout(timeout);
		})
		describe('Query Closed Sessions', () => {
			it('Should Return An Array With The Closed Sessions Information', async () => {
		    const email = 'example@gmail.com';
				const routes = ["dashboard", "sessions", "retrieve", "closed_sessions"]
				const dashboardSessions = new DashboardSessions(Global);
				const response = await dashboardSessions.querySessions(routes, email);

				if(response.length > 0){
					const example = response[0];
					expect(example).to.have.keys("sessionID", "sessionName", "date", "duration", "amount", "withUser", "withUserEmail", "currency", "capture");
				}
			}).timeout(timeout);
		})
	})
	describe('Query Available Sessions', () => {
		it('Should Return An Array With The Sessions Information', async () => {
		  const email = 'example@gmail.com';
			const dashboardSessions = new DashboardSessions(Global);
			const response = await dashboardSessions.queryAvailableSessions(email);

			if(response.length > 0){
				const example = response[0];
				expect(example).to.have.keys("sessionCreator", "sessionAmount", "sessionCurrency", "sessionID", "sessionName", "withUser", "withUserEmail", "fundsLoaded", "fileUploaded");
			}
		}).timeout(timeout);
	})
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
