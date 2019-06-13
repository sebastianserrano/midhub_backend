const NoDataFound = require('../Errors/Database/NoDataFound.js');
const DuplicateEmailError = require('../Errors/Database/DuplicateError/DuplicateEmailError.js');

class DatabaseErrorHandler {
	constructor(){
	
	}

	detectError(error){
		var errorType	= this.detectErrorType(error);
		return errorType;
	}

	detectErrorType(error){
		switch(true){
			case this.detectDuplicateError(error):
				return this.detectDuplicateErrorType(error);
			case this.detectNoDataReturned(error):
				return new NoDataFound();
			default:
				break;
		}
	}

	detectNoDataReturned(error){
		const noDataReturnedRegex = new RegExp('no data returned', 'i');
		return noDataReturnedRegex.test(error.message);
	}

	detectDuplicateError(error){
		const duplicateRegex = new RegExp('duplicate', 'i');
		return duplicateRegex.test(error.message);
	}

	detectDuplicateErrorType(error){
		const duplicateEmailRegex = new RegExp('email', 'i');

		switch(true){
			case duplicateEmailRegex.test(error.message):
				return new DuplicateEmailError()
			default:
				break;
		}
	}
}

module.exports = DatabaseErrorHandler;
