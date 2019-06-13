'use strict';

const ErrorHandler = require('../../Error/ErrorHandler/ErrorHandler.js');
const FileUploadedDatabaseSaver = require('./FileUploadedDatabaseSaver.js');
const FundsLoadedDatabaseSaver = require('./FundsLoadedDatabaseSaver.js');

class SessionDatabaseSaver {
	constructor(global){
		this.database = global.getDatabase();
		this.errorHandler = new ErrorHandler();
		this.fileUploadedDatabaseSaver = new FileUploadedDatabaseSaver(this.database);
		this.fundsLoadedDatabaseSaver = new FundsLoadedDatabaseSaver(this.database);
	}

	async fileUploaded(body){
		try {
			const response = await this.fileUploadedDatabaseSaver.save(body)

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async fundsLoaded(body){
		try {
			const response = await this.fundsLoadedDatabaseSaver.save(body.paymentResponse, body.sessionDetails)

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = SessionDatabaseSaver;
