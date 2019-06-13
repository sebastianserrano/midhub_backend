'use strict';

const ErrorHandler = require('../../Error/ErrorHandler/ErrorHandler.js');
const ChargeExpiredHandler = require('./ChargeExpiredHandler/ChargeExpiredHandler.js');

class Charge {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.database = global.getDatabase();
		this.chargeExpiredHandler = new ChargeExpiredHandler(this.database)
	}

	async handleChargeEvent(routes, body){
		try {
			var response;

			switch(routes[1]){
				case 'expired':
					const paymentID = body.data.object.id;
					const response = await this.chargeExpiredHandler.handleChargeWithPaymentID(paymentID)

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

module.exports = Charge;
