'use strict';

const PayoutsQuerier = require('./PayoutsQuerier.js')
const PayoutsPaymentPlatformQuerier = require('./PayoutsPaymentPlatformQuerier.js')

class DashboardPayouts {
	constructor(global){
		this.database = global.getDatabase();
		this.paymentPlatform = global.getPaymentPlatform();
		this.payoutsQuerier = new PayoutsQuerier(this.database);
	}

	async retrieve(email){
		try {
			const payoutsInfo = await this.payoutsQuerier.queryPayouts(email);

			return payoutsInfo;
		} catch(exception) {
			throw exception;
		}	
	}
}

module.exports = DashboardPayouts;
