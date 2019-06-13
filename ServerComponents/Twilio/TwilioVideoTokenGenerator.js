'use strict';

class TwilioVideoTokenGenerator {
	constructor(global) {
		this.twilio = global.getTwilioPlatform(); 
		this.token = this.twilio.token;
	}

	generateToken(identity, room){
		const token = this.initializeToken()
		this.assignIdentityToToken(identity, token);
		this.grantTokenVideoCaps(room, token)

		return this.serializeToken(token);
	}

	initializeToken(){
		const token = new this.token(
			process.env.TWILIO_ACCOUNT_SID,
			process.env.TWILIO_API_KEY,
			process.env.TWILIO_API_SECRET
		);
	
		return token
	}

	assignIdentityToToken(identity, token){
		token.identity = identity;
	}

	grantTokenVideoCaps(room, token){
		let grant = new this.token.VideoGrant()
		grant.room = room;
		token.addGrant(grant);
	}

	serializeToken(token){
		return token.toJwt();
	}
}

module.exports = TwilioVideoTokenGenerator;
