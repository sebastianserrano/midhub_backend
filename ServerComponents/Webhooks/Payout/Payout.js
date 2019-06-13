'use strict';

const ErrorHandler = require('../../Error/ErrorHandler/ErrorHandler.js');
const FailedPayoutHandler = require('./FailedPayoutHandler/FailedPayoutHandler.js');
const SuccessfulPayoutHandler = require('./SuccessfulPayoutHandler/SuccessfulPayoutHandler.js');

class Payout {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.database = global.getDatabase();
		this.failedPayoutHandler = new FailedPayoutHandler(this.database)
		this.successfulPayoutHandler = new SuccessfulPayoutHandler(this.database)
	}

	async handlePayoutEvent(routes, body){
		try {
			var response;
			var payoutID;

			switch(routes[1]){
				case 'failed':
					payoutID = body.data.object.id;
					response = await this.failedPayoutHandler.handlePayoutWithID(payoutID)

					return response
					break;
				case 'paid':
					payoutID = body.data.object.id;
					response = await this.successfulPayoutHandler.handlePayoutWithID(payoutID)

					return response
					break;
				default:
					break;
			}

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = Payout;
