class ServerError extends Error {
	constructor(){
		super();
		this.type = 'Server'
	}
}

module.exports = ServerError;
