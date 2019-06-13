'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const DashboardBank = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Bank/DashboardBank.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;
var email;
var currency;

describe('Dashboard Bank', () => {
	before(async () => {
		Global = await new Global_();
		email = 'example@gmail.com';
		currency = "usd";
	});

	describe('Incoming', () => {
		it('Should Return An Array With The Incoming Payments Information', async () => {
			const dashboardBank = new DashboardBank(Global);
			const response = await dashboardBank.incoming(email);

			if(response.length > 0){
				const example = response[0];
				expect(example).to.have.keys("Payment ID", "Payment Settlement Date", "Payment Estimated Arrival Date", "Payment Amount", "Payment Net Amount", "Payment Currency", "by", "email");
			}
		}).timeout(timeout);
	}),

	describe('Outgoing', () => {
		it('Should Return An Array With The Outgoing Payouts Information', async () => {
			const dashboardBank = new DashboardBank(Global);
			const response = await dashboardBank.outgoing(email);

			if(response.length > 0){
				const example = response[0];
				expect(example).to.have.keys("Payout Initiation Date", "Payout Amount", "Payout Currency", "Payout Status", "Payout Type", "Payout Type Last Four Digits", "Payout ID");
			}
		}).timeout(timeout);
	})

	describe('Balances', () => {
		it('Should Return An Object With The Available And Incoming Balance Information Upon Success', async () => {
			const dashboardBank = new DashboardBank(Global);
			const response = await dashboardBank.balances(email, currency);

			expect(response).to.have.keys("availableBalance", "incomingBalance");

		}).timeout(timeout);
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
