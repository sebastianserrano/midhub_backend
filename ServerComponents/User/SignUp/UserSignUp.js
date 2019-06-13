'use strict';

const PaymentsUserCreator = require('./PaymentsUserCreator.js');
const DatabaseUserCreator = require('./DatabaseUserCreator.js');
const UserExistanceChecker = require('./UserExistanceChecker.js');

const Promise = require('bluebird');

class UserSignUp {
	constructor(global){
		this.database = global.getDatabase();
		this.paymentPlatform = global.getPaymentPlatform();
	}

	async create(firstName, middleName, lastName, email, password, country, ip){
		try {
			const userCredentials = {
				firstName: firstName,
				middleName: middleName,
				lastName: lastName,
				email: email,
				password: password,
				country: country,
				ip: ip
			}
			const userExistanceChecker = new UserExistanceChecker(this.database);
			await userExistanceChecker.checkEmail(email)

			const paymentUserCredentials = await this.inPaymentPlatform(userCredentials);
			const databaseUser = await this.inDatabase(paymentUserCredentials, userCredentials);

			return true;
		} catch(exception) {
			throw exception;
		}	
	}

	inPaymentPlatform(userCredentials){
		const paymentUser = new PaymentsUserCreator(this.paymentPlatform);
		return paymentUser.create(userCredentials.email, userCredentials.country, userCredentials.ip, userCredentials.firstName, userCredentials.lastName);
	}

	inDatabase(paymentUserCredentials, userCredentials){
		const databaseUser = new DatabaseUserCreator(this.database);
		return databaseUser.create(userCredentials, paymentUserCredentials);
	}
}

module.exports = UserSignUp;
