const DatabaseError = require('./DatabaseError');

class NoDataFound extends DatabaseError {
	constructor(){
		super();
		this.message = 'No Data Found, Please Make Sure You Have Correctly Input Your Information';
	}
}

module.exports = NoDataFound;
