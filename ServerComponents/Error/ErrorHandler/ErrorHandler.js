'use strict';

const DatabaseErrorHandler = require('./DatabaseErrorHandler.js');
const PaymentErrorHandler = require('./PaymentsErrorHandler.js');

class ErrorHandler {
	constructor(){
		this.databaseErrorHandler = new DatabaseErrorHandler();
		this.paymentErrorHandler = new PaymentErrorHandler();
	}

	detectError(error){
		const errorType = this.detectErrorType(error);

		if(errorType == 'Application'){
			return error;
		} else {
			return this.handleSystemError(error)
		}
	}

	detectErrorType(error){
		if(error.type){
			return 'Application'
		} else {
			return 'System'
		}
	}

	handleSystemError(error){
		error.message = 'Our Systems Are Currently Unavailable, Please Try Again Later';
		return error
	}
}

module.exports = ErrorHandler;
