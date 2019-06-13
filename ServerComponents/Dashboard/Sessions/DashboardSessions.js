'use strict';

const OpenSessionsQuerier = require('./OpenSessionsQuerier.js')
const ClosedSessionsQuerier = require('./ClosedSessionsQuerier.js')
const AvailableSessionsQuerier = require('./AvailableSessionsQuerier.js')

class DashboardSessions {
	constructor(global){
		this.database = global.getDatabase();
		this.openSessionsQuerier = new OpenSessionsQuerier(this.database);
		this.closedSessionsQuerier = new ClosedSessionsQuerier(this.database);
		this.availableSessionsQuerier = new AvailableSessionsQuerier(this.database)
	}

	async querySessions(routes, email){
		try {
			var response;

			switch(routes[3]){
				case 'open_sessions':
					response = await this.openSessionsQuerier.querySessions(email);
					break;
				case 'closed_sessions':
					response = await this.closedSessionsQuerier.querySessions(email);
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

	async queryAvailableSessions(email){
		try {
			const sessionsInfo = await this.availableSessionsQuerier.querySessions(email);

			return sessionsInfo;
		} catch(exception) {
			throw exception;
		}	
	}
}

module.exports = DashboardSessions;
