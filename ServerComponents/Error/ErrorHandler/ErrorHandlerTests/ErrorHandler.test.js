'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const ErrorHandler = require(EnvironmentPath + '/src/ErrorHandler/ErrorHandler.js');

const DuplicateEmailError = require(EnvironmentPath + '/src/Errors/Database/DuplicateError/DuplicateEmailError.js');

describe('Error Handler', () => {
	describe('Against Database Errors', () => {
		describe('Like Duplicate Email Key Faults', () => {
			it('Should Return \'Email Already In Use, Please Use A Different Email Account\'', () => {

					const duplicateEmailError = new DuplicateEmailError();
					
					const errorHandler = new ErrorHandler();
					const error = errorHandler.detectError(duplicateEmailError);
						
					expect(error.message).to.equal('Email Already In Use, Please Use A Different Email Account');
			})		
		})
	}),

	describe('Against System Errors', () => {
		it('Should Return \'Our Systems Are Currently Unavailable, Please Try Again Later\'', () => {
					const systemError = new Error();

					const errorHandler = new ErrorHandler();
					const error = errorHandler.detectError(systemError);
						
					expect(error.message).to.equal('Our Systems Are Currently Unavailable, Please Try Again Later');
			
		})
	})
})
