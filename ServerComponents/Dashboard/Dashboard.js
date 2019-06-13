'use strict';

const DashboardProfile = require('./Profile/DashboardProfile.js');
const DashboardSessions = require('./Sessions/DashboardSessions.js');
const DashboardPayouts = require('./Payouts/DashboardPayouts.js');
const DashboardPayments = require('./Payments/DashboardPayments.js');
const DashboardBank = require('./Bank/DashboardBank.js');
const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');

class Dashboard {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.dashboardProfile = new DashboardProfile(global);
		this.dashboardSessions = new DashboardSessions(global);
		this.dashboardPayouts = new DashboardPayouts(global);
		this.dashboardPayments = new DashboardPayments(global);
		this.dashboardBank = new DashboardBank(global);
	}

	async profile(routes, body){
		try {
			var response;

			switch(routes[2]){
				case 'retrieve':
					response = await this.dashboardProfile.retrieve(body.email);
					break;
				case 'update':
					response = await this.dashboardProfile.update(body);
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

	async sessions(routes, body){
		try {
			var response;

			switch(routes[2]){
				case 'retrieve':
					response = await this.dashboardSessions.querySessions(routes, body.email);
					break;
				case 'available_sessions':
					response = await this.dashboardSessions.queryAvailableSessions(body.email);
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

	async payouts(body){
		try {
			const response = await this.dashboardPayouts.retrieve(body.email)

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async payments(routes, body){
		try {
			var response;

			switch(routes[2]){
				case 'released':
			 		response = await this.dashboardPayments.released(body.email)
					break;
				case 'received':
			 		response = await this.dashboardPayments.received(body.email)
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

	async bank(routes, body){
		try {
			var response;

			switch(routes[2]){
				case 'incoming':
					response = await this.dashboardBank.incoming(body.email)
					break;
				case 'outgoing':
					response = await this.dashboardBank.outgoing(body.email)
					break;
				case 'balances':
					response = await this.dashboardBank.balances(body.email, body.currency)
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

module.exports = Dashboard;
