'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');
const Promise = require('bluebird');

class StripeTokenCreator {
	constructor(plaid){
		this.plaid = plaid;
	}

	async createToken(plaidToken, currency){
		try {
			console.log('about to create stripe bank token')
			const token = await this.createStripeToken(plaidToken, currency);
			return token
		} catch(exception){
			console.log(exception)
			reject(exception);
		}
	}

	async createStripeToken(token, currency){
		const plaidToken = await this.plaid.exchangePublicToken(token.public_token)
		console.log('plaid token')
		console.log(plaidToken)
		const accounts = await this.plaid.getAuth(plaidToken.access_token)
		console.log('accounts...')
		console.log(accounts)
		const accountID = this.retrieveAccountIDFromAccountsWithCurrency(accounts, currency)
		console.log('account id')
		console.log(accountID)
		const stripeToken = await this.plaid.createStripeToken(plaidToken.access_token, accountID)
		console.log('stripe token')
		console.log(stripeToken)
		const bankAccountToken = stripeToken.stripe_bank_account_token;
		console.log('My bank account stripe token is')
		console.log(bankAccountToken)

		return bankAccountToken;
	}

	retrieveAccountIDFromAccountsWithCurrency(info, currency){
		switch(currency) {
			case "CAD":
				if (info.numbers.eft.length > 0) {
					const account = info.numbers.eft.find(canadianAccount => {
						const canadianAccountID = canadianAccount.account_id;
						const bankAccount = info.accounts.find(bankAccount => bankAccount.account_id === canadianAccountID)
						const typeCheck = this.checkBankAccountType(bankAccount);
						const currencyCheck = this.checkBankAccountCurrency(bankAccount, currency)

						if(typeCheck && currencyCheck){
							return canadianAccount;
						}
					})

					return account.account_id;
				} else {
					throw new Error()
				}
				break;
			case "USD":
				if (info.numbers.ach.length > 0) {
					const account = info.numbers.ach.find(americanAccount => {
						const americanAccountID = americanAccount.account_id;
						const bankAccount = info.accounts.find(bankAccount => bankAccount.account_id === americanAccountID)
						const typeCheck = this.checkBankAccountType(bankAccount);
						const currencyCheck = this.checkBankAccountCurrency(bankAccount, currency)

						if(typeCheck && currencyCheck){
							return americanAccount;
						}
					})

					return account.account_id;
				} else {
					throw new Error()
				}
				break;
			default:
				return
		}
	}

	checkBankAccountType(bankAccount){
		if(bankAccount.subtype === "checking" || bankAccount.subtype === "savings"){
			return true;
		}
		return false;
	}

	checkBankAccountCurrency(bankAccount, currency){
		if(bankAccount.balances.iso_currency_code === currency){
			return true;
		}
		return false;
	}
}

module.exports = StripeTokenCreator;
