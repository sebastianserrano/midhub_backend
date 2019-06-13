'use strict';

const EnvironmentPath= process.env.MIDHUB;
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');
const TwilioVideoTokenGenerator = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Twilio/TwilioVideoTokenGenerator.js');
const TwilioChatTokenGenerator = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Twilio/TwilioChatTokenGenerator.js');
const expect = require('chai').expect;

var Global;
var identity = 'TestIdentity';
var room = 'TestRoom';

describe('Twilio Token', () => {
	before(async () => {
		Global = await new Global_();
	});
	describe('Video Generator', () => {
		describe('Token Grants', () => {
			it('Should contain video capabilities', () => {
				const token = new TwilioVideoTokenGenerator(Global);
				const accessToken = new token.token(
					process.env.TWILIO_ACCOUNT_SID,
					process.env.TWILIO_API_KEY,
					process.env.TWILIO_API_SECRET
				);

				token.assignIdentityToToken(identity, accessToken);
				token.grantTokenVideoCaps(room, accessToken);

				expect(accessToken.grants).to.have.lengthOf(1);
				expect(accessToken.grants[0]).to.have.own.property('room');
				expect(accessToken.grants[0]).to.own.include({'room': room});
			});
		}),

		describe('Token serialized', () => {
			it('Should contain 432 characters', () => {
				const token = new TwilioVideoTokenGenerator(Global);

				const response = token.generateToken(identity, room);
				expect(String(response)).to.have.lengthOf(432);
			})
		})
	}),

	describe('Chat Generator', () => {
		describe('Token Grants', () => {
			it('Should contain chat capabilities', () => {
				const token = new TwilioChatTokenGenerator(Global);
				const accessToken = new token.token(
					process.env.TWILIO_ACCOUNT_SID,
					process.env.TWILIO_API_KEY,
					process.env.TWILIO_API_SECRET
				);

				token.assignIdentityToToken(identity, accessToken);
				token.grantTokenChatCaps(room, accessToken);

				expect(accessToken.grants).to.have.lengthOf(1);
				expect(accessToken.grants[0]).to.have.own.property('room');
				expect(accessToken.grants[0]).to.own.include({'room': room});
			});
		}),

		describe('Token serialized', () => {
			it('Should contain 475 characters', () => {
				const token = new TwilioChatTokenGenerator(Global);

				const response = token.generateToken(identity, room);
				expect(String(response)).to.have.lengthOf(475);
			})
		})
	})
})
