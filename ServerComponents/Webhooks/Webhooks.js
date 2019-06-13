'use strict';

const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');
const extractRouteFromPath = require('../Utilities/ExtractPaymentPlatformRoute.js');
const Charge = require('./Charge/Charge.js');
const Payout = require('./Payout/Payout.js');

class Webhooks {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.charge = new Charge(global)
		this.payout = new Payout(global)
	}

	async paymentPlatform(body){
		try {
			var response;
			const extractedRoutes = extractRouteFromPath(body.type)

			switch(extractedRoutes[0]){
				case 'charge':
					response = await this.charge.handleChargeEvent(extractedRoutes, body)

					return response;
					break;
				case 'payout':
					response = await this.payout.handlePayoutEvent(extractedRoutes, body)

					return response;
					break;
				default:
					return true
			}

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = Webhooks;
