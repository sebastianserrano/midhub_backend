const User = require('../../ServerComponents/User/User.js');

class UserRouteHandler {
	constructor(global) {
		this.user = new User(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'login':
				var { loginEmail, loginPassword } = body;
				var response = await this.user.login(loginEmail, loginPassword);

				return response;
			case 'signup':
				var { firstName, middleName, lastName, email, password, country, ip } = body;
				var response = await this.user.signup(firstName, middleName, lastName, email, password, country, ip);

				return true
			default:
				break;
		}
	}
}

module.exports = UserRouteHandler;
