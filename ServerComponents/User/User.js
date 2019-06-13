'use strict';

const UserSignUp = require('./SignUp/UserSignUp.js');
const UserLogin = require('./Login/UserLogin.js');
const UserSignupLimiter = require('./UserSignupLimiter/UserSignupLimiter.js');
const ErrorHandler = require('../Error/ErrorHandler/ErrorHandler.js');

const Promise = require('bluebird');

class User {
	constructor(global){
		this.global = global;
		this.errorHandler = new ErrorHandler();
	}

	async login(email, password){
		try {
			const login = new UserLogin(this.global);
			const response = await login.checkCredentials(email, password);

			return response;
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}

	async signup(firstName, middleName, lastName, email, password, country, ip){
		try {
			const userSignupLimiter = new UserSignupLimiter(this.global)
			await userSignupLimiter.checkNumberOfCurrentUsers();

			const signup = new UserSignUp(this.global);
			const response = await signup.create(firstName, middleName, lastName, email, password, country, ip)

			return response;	
		} catch(exception) {
			const error = this.errorHandler.detectError(exception);
			throw error;
		}
	}
}

module.exports = User;
