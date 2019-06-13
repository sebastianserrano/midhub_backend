const Twilio = require('../../ServerComponents/Twilio/Twilio.js');

class TwilioRouteHandler {
	constructor(global) {
		this.twilio = new Twilio(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'video':
				var response = this.twilio.generateVideoToken(body);

				return response;
			case 'chat':
				var response = this.twilio.generateChatToken(body);

				return response;
			default:
				break;
		}
	}
}

module.exports = TwilioRouteHandler;
