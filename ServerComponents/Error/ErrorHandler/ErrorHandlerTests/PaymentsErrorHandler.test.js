'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const PaymentsErrorHandler = require(EnvironmentPath + '/src/ErrorHandler/PaymentsErrorHandler.js');

describe("Payments Error Handler", () => {
	it("Should Detect An Overall System Error Type", () => {
		const paymentsError = new Error();
		paymentsError.type =  'StripeInvalidRequestError';

		const paymentsErrorHandler = new PaymentsErrorHandler();
		const errorType = paymentsErrorHandler.detectError(paymentsError);

		expect(errorType.type).to.equal('Payments');
	})
})

