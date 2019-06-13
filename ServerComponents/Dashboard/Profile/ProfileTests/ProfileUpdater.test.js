'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');
const ProfileUpdater = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Profile/ProfileUpdater.js')

var Global;

describe('Dashboard Profile Updater', () => {
	before(async function() {
		Global = await new Global_();
	}),
	it('Should Return True Upon Success', async () => {
		const body = {
			DOB: '1992-02-30',
			UserPersonalID: '222-222-2222',
			PhoneNumber: '+1 647 758 8485',
			Email: 'example@gmail.com',
			StreetName: '',
			StreetNumber: '',
			AptNumber: '',
			City: '',
			State: '',
			Country: 'Canada',
			Zip: 'L4G 7N8'
		}

		const user = new ProfileUpdater(Global);
		const response = await user.updateProfile(body);

		expect(response).to.be.true;

	}).timeout(timeout),
	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
