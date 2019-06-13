'use strict';

class TwilioChatTokenGenerator {
	constructor(global) {
		this.twilio = global.getTwilioPlatform(); 
		this.token = this.twilio.token;
	}

	generateToken(identity, room){
		const token = this.initializeToken()
		this.assignIdentityToToken(identity, token);
		this.grantTokenChatCaps(room, token)

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

	grantTokenChatCaps(room, token){
    const chatGrant = new this.token.ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
    });
		chatGrant.room = room;
		token.addGrant(chatGrant);
	}

	serializeToken(token){
		return token.toJwt();
	}
}

module.exports = TwilioChatTokenGenerator;
