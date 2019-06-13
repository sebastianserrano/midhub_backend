'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const DashboardPayments = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Payments/DashboardPayments.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Dashboard Payments', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Released', () => {
		it('Should Return An Array With The Released Payments Information', async () => {
		  const email = 'example@gmail.com';
			const dashboardPayments = new DashboardPayments(Global);
			const response = await dashboardPayments.released(email);

			if(response.length >= 0){
				const example = response[0];
				expect(example).to.have.keys("Payment Initiation Date", "Payment Settlement Date", "Payment Amount", "Payment Currency", "Payment Status", "Payment ID", "to", "email");
			}
		}).timeout(timeout);
	})

	describe('Received', () => {
		it('Should Return An Array With The Received Payments Information', async () => {
		  const email = 'example@gmail.com';
			const dashboardPayments = new DashboardPayments(Global);
			const response = await dashboardPayments.received(email);

			if(response.length >= 0){
				const example = response[0];
				expect(example).to.have.keys("Payment Initiation Date", "Payment Settlement Date", "Payment Amount", "Payment Currency", "Payment Status", "Payment ID", "User ID", "by", "email");
			}
		}).timeout(timeout);
	})
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
