'use strict';

const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');
const SessionCreator = require('./SessionCreator/SessionCreator.js');
const SessionUpdater = require('./SessionUpdater/SessionUpdater.js');
const SessionUserEmailChecker = require('./SessionUserEmailChecker/SessionUserEmailChecker.js');

class Sessions {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.sessionCreator = new SessionCreator(global);
		this.sessionUpdater = new SessionUpdater(global);
		this.sessionUserEmailChecker = new SessionUserEmailChecker(global);
	}

	async createSession(routes,body){
		var response;

		switch(routes[2]){
			case 'file_uploaded':
				response = await this.sessionCreator.createSessionWithFile(body)

				return response;
			case 'load_funds':
				response = await this.sessionCreator.createSessionWithFunds(routes, body)

				return response;
			default:
				return
		}
	}

	async updateSession(routes, body){
		var response;

		switch(routes[2]){
			case 'file_uploaded':
				response = await this.sessionUpdater.updateSessionWithFile(body)

				return response;
			case 'load_funds':
				response = await this.sessionUpdater.updateSessionWithFunds(routes, body)

				return response;
			case 'session_unavailable':
				response = await this.sessionUpdater.updateSessionUnavailable(body)

				return response;
			case 'capture_payment':
				response = await this.sessionUpdater.updateSessionCapturePayment(body)

				return response;
			default:
				return
		}
	}

	async checkUserWithEmail(body){
		try {
			const response = await this.sessionUserEmailChecker.checkEmail(body.email);

			return response;
		} catch(exception) {
			throw exception;
		}	
	}
}

module.exports = Sessions;
