const DatabaseError = require('../DatabaseError');

class DuplicateEmailError extends DatabaseError {
	constructor(){
		super();
		this.message = 'Email Already In Use, Please Use A Different Email Account';
	}
}

module.exports = DuplicateEmailError;
