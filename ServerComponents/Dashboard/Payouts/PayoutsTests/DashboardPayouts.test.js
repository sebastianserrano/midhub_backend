'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const DashboardPayouts = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Payouts/DashboardPayouts.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Dashboard Payouts', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Retrieve', () => {
		it('Should Return An Array With The Payouts Information', async () => {
		  const email = 'example@gmail.com';
			const dashboardPayouts = new DashboardPayouts(Global);
			const response = await dashboardPayouts.retrieve(email);

			if(response.length >= 0){
				const example = response[0];
				expect(example).to.have.keys("Payout Initiation Date", "Payout Release Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Type", "Payout Type Last Four Digits", "Payout ID");
			}
		}).timeout(timeout);
	})
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
