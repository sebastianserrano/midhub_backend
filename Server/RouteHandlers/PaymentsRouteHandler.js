const PaymentCardHandler = require('../../ServerComponents/Payments/PaymentCardHandler.js');

class PaymentRouteHandler {
	constructor(global) {
		this.paymentCardHandler = new PaymentCardHandler(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'save_card':
				var response = await this.paymentCardHandler.saveCard(body.userEmail, body.card);

				return response;
			case 'query_cards':
				var response = await this.paymentCardHandler.queryCards(body.userEmail);

				return response;
			default:
				break;
		}
	}
}

module.exports = PaymentRouteHandler;
