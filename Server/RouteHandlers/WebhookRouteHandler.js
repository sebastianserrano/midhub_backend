const Webhooks = require('../../ServerComponents/Webhooks/Webhooks.js');

class WebhookRouteHandler {
	constructor(global) {
		this.webhooks = new Webhooks(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'public_payment_platform':
				var response = await this.webhooks.paymentPlatform(body);

				return response;
			default:
				return
		}
	}
}

module.exports = WebhookRouteHandler;
