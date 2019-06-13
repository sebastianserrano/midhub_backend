'use strict';

const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');
const FileDatabaseQuerier = require('./FileDatabaseQuerier/FileDatabaseQuerier.js');

class Files {
	constructor(global){
		this.errorHandler = new ErrorHandler();
		this.database = global.getDatabase();
		this.fileDatabaseQuerier = new FileDatabaseQuerier(this.database);
	}

	async retrieveFileLink(body){
		try {
			const	response = await this.fileDatabaseQuerier.retrieveFileLink(body.sessionDetails);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = Files;
