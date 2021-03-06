'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const Payout = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Webhooks/Payout/Payout.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Payout', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Event', () => {
		describe('Handle Failed Payout', () => {
			it('Should Return True Upon Succesful Update', async () => {
				const routes = ["payout", "failed"]
				const body = {
					created: 1326853478,
					livemode: false,
					id: 'payout.expired_00000000000000',
					type: 'payout.failed',
					object: 'event',
					request: null,
					pending_webhooks: 1,
					api_version: '2019-02-19',
					data: 
					 { object: 
							{ id: 'po_1EBQtLLIIoPhKUjRNBiZ3jQV',
								object: 'payout',
								amount: 100,
								amount_refunded: 0,
								application: null,
								application_fee: null,
								application_fee_amount: null,
								balance_transaction: 'txn_00000000000000',
								captured: false,
								created: 1552064095,
								currency: 'cad',
								customer: null,
								description: 'My First Test Payout (created for API docs)',
								destination: null,
								dispute: null,
								failure_code: null,
								failure_message: null,
								fraud_details: {},
								invoice: null,
								livemode: false,
								metadata: {},
								on_behalf_of: null,
								order: null,
								outcome: null,
								paid: true,
								payment_intent: null,
								receipt_email: null,
								receipt_number: null,
								receipt_url: 'https://pay.stripe.com/receipts/acct_1DRNUOIuaqSbzEWE/ch_1EBlyFIuaqSbzEWEk8p306LS/rcpt_Ef6Ac7zZ3GA4ALAqH4Z2bX4FMetF9fU',
								refunded: false,
								refunds: [Object],
								review: null,
								shipping: null,
								source: [Object],
								source_transfer: null,
								statement_descriptor: null,
								status: 'succeeded',
								transfer_data: null,
								transfer_group: null 
							} 
					 } 
				}

				const payout = new Payout(Global);
				const response = await payout.handlePayoutEvent(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		}),

		describe('Handle Successful Payout', () => {
			it('Should Return True Upon Succesful Update', async () => {
				const routes = ["payout", "paid"]
				const body = {
					created: 1326853478,
					livemode: false,
					id: 'payout.expired_00000000000000',
					type: 'payout.paid',
					object: 'event',
					request: null,
					pending_webhooks: 1,
					api_version: '2019-02-19',
					data: 
					 { object: 
							{ id: 'po_1EBQu5LIIoPhKUjRSYLKqLhx',
								object: 'payout',
								amount: 100,
								amount_refunded: 0,
								application: null,
								application_fee: null,
								application_fee_amount: null,
								balance_transaction: 'txn_00000000000000',
								captured: false,
								created: 1552064095,
								currency: 'cad',
								customer: null,
								description: 'My First Test Payout (created for API docs)',
								destination: null,
								dispute: null,
								failure_code: null,
								failure_message: null,
								fraud_details: {},
								invoice: null,
								livemode: false,
								metadata: {},
								on_behalf_of: null,
								order: null,
								outcome: null,
								paid: true,
								payment_intent: null,
								receipt_email: null,
								receipt_number: null,
								receipt_url: 'https://pay.stripe.com/receipts/acct_1DRNUOIuaqSbzEWE/ch_1EBlyFIuaqSbzEWEk8p306LS/rcpt_Ef6Ac7zZ3GA4ALAqH4Z2bX4FMetF9fU',
								refunded: false,
								refunds: [Object],
								review: null,
								shipping: null,
								source: [Object],
								source_transfer: null,
								statement_descriptor: null,
								status: 'succeeded',
								transfer_data: null,
								transfer_group: null 
							} 
					 } 
				}

				const payout = new Payout(Global);
				const response = await payout.handlePayoutEvent(routes, body);

				expect(response).to.be.true;
			}).timeout(timeout);
		})
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
