const Dashboard = require('../../ServerComponents/Dashboard/Dashboard.js');

class DashboardRouteHandler {
	constructor(global) {
		this.dashboard = new Dashboard(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'profile':
				var response = await this.dashboard.profile(routes, body);

				return response;
			case 'sessions':
				var response = await this.dashboard.sessions(routes, body)

				return response;
			case 'payouts':
				var response = await this.dashboard.payouts(body)

				return response;
			case 'payments':
				var response = await this.dashboard.payments(routes, body)

				return response;
			case 'bank':
				var response = await this.dashboard.bank(routes, body)

				return response;
			default:
				break;
		}
	}
}

module.exports = DashboardRouteHandler;
