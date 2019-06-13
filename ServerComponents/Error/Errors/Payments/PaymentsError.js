class PaymentsError extends Error {
	constructor(){
		super();
		this.type = 'Payments'
	}
}

module.exports = PaymentsError;
