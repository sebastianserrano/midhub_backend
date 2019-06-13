const jwt = require('jsonwebtoken');
const config = require('./Config.json');

class JWTGenerator {
	constructor(){
	}
	
	generateToken(email){
		return jwt.sign({ sub: email }, config.secret);
	}

}

module.exports = JWTGenerator;
