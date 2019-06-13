'use strict';

const TwilioVideoTokenGenerator = require('./TwilioVideoTokenGenerator.js');
const TwilioChatTokenGenerator = require('./TwilioChatTokenGenerator.js');
const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');

class Twilio {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.twilioVideoTokenGenerator = new TwilioVideoTokenGenerator(global)
		this.twilioChatTokenGenerator = new TwilioChatTokenGenerator(global)
	}

	generateVideoToken(body){
		try {
			const response = this.twilioVideoTokenGenerator.generateToken(body.identity, body.room)

			return {
				token: response
			};
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	generateChatToken(body){
		try {
			const response = this.twilioChatTokenGenerator.generateToken(body.identity, body.room)

			return {
				token: response
			};
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = Twilio;
