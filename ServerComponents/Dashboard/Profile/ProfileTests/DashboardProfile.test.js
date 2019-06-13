'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const DashboardProfile = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Profile/DashboardProfile.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Dashboard Profile', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Retrieve', () => {
		it('Should Return An Object With Personal User Information Upon Success', async () => {
		  const email = 'example@gmail.com';
			const dashboardProfile = new DashboardProfile(Global);
			const response = await dashboardProfile.retrieve(email);

			expect(response).to.have.key('User ID', 'First Name', 'Middle Name', 'Last Name', 'Email', 'DOB', 'User Personal ID', 
																	 'Phone Number', 'User Street Name', 'User Street Number', 'User Apt Number', 'User City', 
																		'User State', 'User Country', 'User Zip Code');
		}).timeout(timeout + 10000);
	}),

	describe('Update', () => {
		it('Should Return True Upon Success', async () => {
			const body = {
				DOB: '1960-05-24',
				UserPersonalID: '278-222-000',
				PhoneNumber: '+1 647 864 4749',
				Email: 'example@gmail.com',
				StreetName: 'Cordova',
				StreetNumber: 90,
				AptNumber: 115,
				City: 'San Andres',
				State: 'New Brunswick',
				Country: 'Canada',
				Zip: 'M3C 3A3'
			}

			const dashboardProfile = new DashboardProfile(Global);
			const response = await dashboardProfile.update(body);

			expect(response).to.be.true;
		}).timeout(timeout + 10000);
	}),

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
