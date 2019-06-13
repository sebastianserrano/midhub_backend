'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const DatabaseErrorHandler = require(EnvironmentPath + '/src/ErrorHandler/DatabaseErrorHandler.js');
const DuplicateEmailError = require(EnvironmentPath + '/src/Errors/Database/DuplicateError/DuplicateEmailError.js');

describe("Database Error Handler", () => {
	it("Should Detect A Database Error Type", () => {
		const databaseError = new Error();
		databaseError.message = 'duplicate key value violates unique constraint "Users_Email_key"';

		const databaseErrorHandler = new DatabaseErrorHandler();
		const errorType = databaseErrorHandler.detectError(databaseError);

		expect(errorType.type).to.equal('Database');
	}),

	it("Should Detect A Duplicate Error Type", () => {
		const duplicateError = new Error()
		duplicateError.message = 'DUPLICATE key value testing words';

		const databaseErrorHandler = new DatabaseErrorHandler();
		const duplicateErrorType = databaseErrorHandler.detectDuplicateError(duplicateError);

		expect(duplicateErrorType).to.be.true;
	}),

	it("Should Detect A Duplicate Email Error Type", () => {
		const duplicateEmailError = new Error();
		duplicateEmailError.message = '"Users_EMAIL_key"';

		const databaseErrorHandler = new DatabaseErrorHandler();
		const errorType = databaseErrorHandler.detectDuplicateErrorType(duplicateEmailError);

		expect(errorType.message).to.equal('Email Already In Use, Please Use A Different Email Account');
	})
})

