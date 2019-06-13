const Payouts = require('../../ServerComponents/Payouts/Payouts.js');

class PayoutsRouteHandler {
	constructor(global) {
		this.payouts = new Payouts(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'save_payout':
				var response = await this.payouts.savePayout(body);

				return response;
			case 'retrieve_payout_methods':
				var response = await this.payouts.retrievePayoutMethods(body);

				return response;
			case 'create_payout':
				var response = await this.payouts.createPlatformPayout(body);

				return response;
			default:
				break;
		}
	}
}

module.exports = PayoutsRouteHandler;
