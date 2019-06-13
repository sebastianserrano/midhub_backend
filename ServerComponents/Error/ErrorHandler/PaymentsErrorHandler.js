const PaymentsSystemError = require('../Errors/Payments/PaymentsSystemError');

class PaymentErrorHandler {
	constructor(){
		this.paymentsSystemError = new PaymentsSystemError();
	}

	detectError(error){
		switch (error.type) {
			case 'StripeCardError':
				// A declined card error
				return error
			case 'RateLimitError':
				// Too many requests made to the API too quickly
				break;
			case 'StripeInvalidRequestError':
				// Invalid parameters were supplied to Stripe's API
				return this.paymentsSystemError;
			case 'StripeAPIError':
				// An error occurred internally with Stripe's API
				return this.paymentsSystemError;
			case 'StripeConnectionError':
				// Some kind of error occurred during the HTTPS communication
				return this.paymentsSystemError;
			case 'StripeAuthenticationError':
				// You probably used an incorrect API key
				return this.paymentsSystemError;
			default:
				// Handle any other types of unexpected errorors
				return this.paymentsSystemError;
		}
	}
}

module.exports = PaymentErrorHandler;
