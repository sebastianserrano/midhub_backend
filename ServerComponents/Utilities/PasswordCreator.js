'use strict';

const uuid = require('uuid/v4');
const Crypto = require('crypto');

class PasswordCreator {
	constructor(){
	}

  create(password, algorithm){
		var salt = this.createSalt();
		var hash = this.createHash(salt, password, algorithm)

		return {
			Salt: salt,
			Hash: hash
		}
	}

	createHash(salt, password, algorithm){
		var hash = Crypto.createHash(algorithm);
		  hash.update(salt);
			hash.update(password);

			return hash.digest('hex');
	}

	createSalt(){
		return uuid();
	}
}

module.exports = PasswordCreator;
