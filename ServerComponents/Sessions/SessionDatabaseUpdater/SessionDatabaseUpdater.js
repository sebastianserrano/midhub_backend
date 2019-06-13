'use strict';

const ErrorHandler = require('../../Error/ErrorHandler/ErrorHandler.js');
const FileDatabaseUpdater = require('./FileDatabaseUpdater.js');
const FundsDatabaseUpdater = require('./FundsDatabaseUpdater.js');
const AvailabilityDatabaseUpdater = require('./AvailabilityDatabaseUpdater.js');
const Payments = require('../../Payments/Payments.js');

class SessionDatabaseUpdater {
	constructor(global){
		this.database = global.getDatabase();
		this.errorHandler = new ErrorHandler();
		this.fileDatabaseUpdater = new FileDatabaseUpdater(this.database);
		this.fundsDatabaseUpdater = new FundsDatabaseUpdater(this.database);
		this.availabilityDatabaseUpdater = new AvailabilityDatabaseUpdater(this.database);
		this.payments = new Payments(global);
	}

	async updateWithFile(body){
		try {
			const response = await this.fileDatabaseUpdater.update(body)

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async updateWithFunds(body){
		try {
			const response = await this.fundsDatabaseUpdater.update(body.paymentDetails, body.sessionDetails)

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async updateSessionUnavailable(body){
		try {
			const response = await this.availabilityDatabaseUpdater.updateUnavailable(body.sessionDetails)

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = SessionDatabaseUpdater;
