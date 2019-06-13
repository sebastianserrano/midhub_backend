const Sessions = require('../../ServerComponents/Sessions/Sessions.js');

class SessionsRouteHandler {
	constructor(global) {
		this.sessions = new Sessions(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'create_session':
				var response = await this.sessions.createSession(routes, body);

				return response;
			case 'update_session':
				var response = await this.sessions.updateSession(routes, body);

				return response;
			case 'check_user_email':
				var response = await this.sessions.checkUserWithEmail(body);

				return response;
			default:
				break;
		}
	}
}

module.exports = SessionsRouteHandler;
