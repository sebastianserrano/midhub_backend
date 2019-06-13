const ServerError = require('../ServerError');

class PasswordsDontMatch extends ServerError {
	constructor(){
		super();
		this.message = 'Incorrect Password, Please Try Again';
	}
}

module.exports = PasswordsDontMatch;
