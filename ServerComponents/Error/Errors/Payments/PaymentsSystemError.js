const PaymentsError = require('./PaymentsError');

class PaymentsSystemError extends PaymentsError {
	constructor(){
		super();
		this.message = 'Our Systems Are Currently Unavailable, Please Try Again Later'
	}
}

module.exports = PaymentsSystemError;
