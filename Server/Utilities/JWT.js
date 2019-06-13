const expressJwt = require('express-jwt');
const config = require('./Config.json');

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
						'/',
						'/terms_of_service',
						'/privacy_policy',
						'/contact_us',
						'/about',
						'/login',
						'/signup',
						'/dashboard',
						'/dashboard/bank',
						'/dashboard/payments',
						'/dashboard/payouts/',
						'/dashboard/sessions/',
						'/dashboard/profile/',
						'/create_session',
						'/load_funds',
						'/upload_file',
						'/session',
						'/download_file',
						'/user/signup',
						'/user/login',
						/css\/*/,
						/images\/*/,
						'/scripts/front.js',
						'/static/js/1.198865af.chunk.js',
						'/static/js/main.453f657a.chunk.js',
						'/webhook/public_payment_platform'
        ]
    });
}

module.exports = jwt;
