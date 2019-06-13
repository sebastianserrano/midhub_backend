'use strict';

const ProfileQuerier = require('./ProfileQuerier.js')
const ProfileUpdater = require('./ProfileUpdater.js')

class DashboardProfile {
	constructor(global){
		this.database = global.getDatabase();
		this.paymentPlatform = global.getPaymentPlatform();
		this.profileQuerier = new ProfileQuerier(this.database);
		this.profileUpdater = new ProfileUpdater(global);
	}

	async retrieve(email){
		try {
			const userCredentials = await this.profileQuerier.queryProfile(email);

			return userCredentials;
		} catch(exception) {
			throw exception;
		}	
	}

	async update(body){
		try {
			const updateResponse = await this.profileUpdater.updateProfile(body);

			return updateResponse;
		} catch(exception) {
			throw exception;
		}	
	}
}

module.exports = DashboardProfile;
