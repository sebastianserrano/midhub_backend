const Promise = require('bluebird');
const DatabaseConnectionManager = require('../../ServerComponents/Database/DatabaseConnectionManager.js');
const CSVTransformer = require('../Utilities/CSVTransformer.js')
const Twilio = require('twilio');
const Plaid = require('plaid');
const EnvironmentPath = process.env.MIDHUB;

require('dotenv').config();

class Global {
	constructor() {
		return new Promise(async (resolve, reject) => {
			try {
				this.paymentPlatform = this.initializeStripe();
				this.plaid = this.initializePlaid();
				this.database = await this.initializeDatabase();
				this.twilio = this.initializeTwilio();
				this.states = await this.initializeStates();
			
				resolve(this)
			} catch(exception) {
				reject(exception)
			}
		})
	}

	initializeStripe(){
		const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

		return Stripe;
	}

	initializePlaid(){
		const plaid = new Plaid.Client(
			process.env.PLAID_CLIENT_ID,
			process.env.PLAID_SECRET,
			process.env.PLAID_PUBLIC_KEY,
			Plaid.environments.sandbox,
			{version: '2018-05-22'}
		);

		return plaid;
	}

	initializeDatabase(){
		return new Promise(async(resolve, reject) => {
			const databaseCredentials = {
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				database: process.env.DB_NAME,
				user: process.env.DB_USER,
				password: process.env.DB_PASSWD,
			};
			const databaseConnectionManager = new DatabaseConnectionManager(databaseCredentials);
			const databaseConnection = await databaseConnectionManager.establishDatabaseConnection();

			resolve(databaseConnection);
		}) 
	}

	initializeTwilio(){
		const AccessToken = Twilio.jwt.AccessToken;

		return {
			token: AccessToken
		};
	}

	async initializeStates(){
		const CSV_Transformer = new CSVTransformer();

		const canadian_states_path = 'canadian_states.csv'
		const american_states_path = 'american_states.csv'

		const fileNames = [canadian_states_path, american_states_path]
		const countryStates = []

		fileNames.forEach(fileName => {
			const object = CSV_Transformer.transformCSVWithName(fileName);
			countryStates.push(object)
		})

		const finalStates = await Promise.all(countryStates)
		const states = []
		finalStates.forEach(stateObject => {
			states.push(...stateObject)
		})

		return states
	}

	getPlaid(){
		return this.plaid;
	}

	getDatabase(){
		return this.database;
	}

	getPaymentPlatform(){
		return this.paymentPlatform;
	}

	getTwilioPlatform(){
		return this.twilio;
	}

	getStates(){
		return this.states;
	}
}

module.exports = Global;
