'use strict';

const PaymentsErrorHandler = require('../../Error/ErrorHandler/PaymentsErrorHandler.js');

const Promise = require('bluebird');

class PaymentsUserCreator {
	constructor(platform){
		this.platform = platform;
		this.paymentsErrorHandler = new PaymentsErrorHandler();
	}

	create(email, country, ip, firstName, lastName){
		return new Promise(async (resolve, reject) => {
			try {
				const connectAccount = await this.createConnectAccount(email, country, ip, firstName, lastName);
				const customerAccount = await this.createCustomerAccount(email);

				resolve(this.buildResponse(customerAccount, connectAccount));
			} catch(exception) {
				const error = this.paymentsErrorHandler.detectError(exception);
				reject(error);
			}
		});
	}

	buildResponse(customerAccount, connectAccount){
		var response = {	
			customer: {
				ID: customerAccount.id	
			},
			connect: {
				ID: connectAccount.id
			}
		}
		return response;
	}

	createCustomerAccount(email){
		return new Promise((resolve, reject) => {
			this.platform.customers.create({
				email: this.email
			}, (error, response) => {
				if(response) resolve({ id: response.id });
				if(error) reject(error);
			})
		})
	}

	createConnectAccount(email, country, ip, firstName, lastName){
		return new Promise((resolve, reject) => {
			switch(country){
				case "CA":
					this.platform.accounts.create({
						type: 'custom',
						email: email,
						country: country,
						tos_acceptance: {
							date: Math.floor(Date.now() / 1000),
							ip: ip
						},
						business_type: "individual",
						individual: {
							first_name: firstName,
							last_name: lastName,
							email: email
						},
						settings: {
							payouts: {
								schedule: {
									interval: "manual"
								}
							}
						}
					}, (error, response) => {
						if(response) resolve({ id: response.id});
						if(error) reject(error);
					})

					break;
				case "US":
					this.platform.accounts.create({
						type: 'custom',
						email: email,
						country: country,
						tos_acceptance: {
							date: Math.floor(Date.now() / 1000),
							ip: ip
						},
						business_type: "individual",
						business_profile: {
							url: "midhub.co"
						},
						individual: {
							first_name: firstName,
							last_name: lastName,
							email: email
						},
						requested_capabilities: ["platform_payments"],
						settings: {
							payouts: {
								schedule: {
									interval: "manual"
								}
							}
						}
					}, (error, response) => {
						if(response) resolve({ id: response.id});
						if(error) reject(error);
					})

					break;

				default:
					return
			}
		})
	}
}

module.exports = PaymentsUserCreator;
