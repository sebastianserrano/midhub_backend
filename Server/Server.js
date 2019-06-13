'use strict';

const PORT = process.env.PORT || 3000;
const fs = require('fs');
const http = require('http');
const path = require('path');
const cors = require('cors');
const jwt = require('./Utilities/JWT.js');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
app.use(jwt());

const Global_ = require('./Global/Global.js');
const extractRouteFromPath = require('./Utilities/ServerUtilities.js');
const UserRouteHandler = require('./RouteHandlers/UserRouteHandler.js');
const DashboardRouteHandler = require('./RouteHandlers/DashboardRouteHandler.js');
const TwilioRouteHandler = require('./RouteHandlers/TwilioRouteHandler.js');
const SessionsRouteHandler = require('./RouteHandlers/SessionsRouteHandler.js');
const PaymentsRouteHandler = require('./RouteHandlers/PaymentsRouteHandler.js');
const PayoutsRouteHandler = require('./RouteHandlers/PayoutsRouteHandler.js');
const FilesRouteHandler = require('./RouteHandlers/FilesRouteHandler.js');
const WebhookRouteHandler = require('./RouteHandlers/WebhookRouteHandler.js');
const errorHandler = require('./ErrorHandler/ErrorHandler.js')

var userRouteHandler;
var dashboardRouteHandler;
var twilioRouteHandler;
var sessionsRouteHandler;
var paymentsRouteHandler;
var payoutsRouteHandler;
var filesRouteHandler;
var webhookRouteHandler;
var httpServer = http.createServer(app);

app.post('/user/*', async (request, response) => {
	try {
		const extractedRoutes = extractRouteFromPath(request.path)
		const ip = request.connection.remoteAddress;
		request.body["ip"] = ip
		const backendResponse = await userRouteHandler.handleRequest(extractedRoutes, request.body);

		response.send(backendResponse);
	} catch(exception) {
		response.status(400).send(exception.message);
	}
})

app.post('/dashboard/*', async (request, response) => {
	try {
		const extractedRoutes = extractRouteFromPath(request.path)
		const backendResponse = await dashboardRouteHandler.handleRequest(extractedRoutes, request.body);

		response.send(backendResponse);
		
	} catch(exception){
		response.status(400).send(exception.message);
	}
})

app.post('/twilio/*', async (request, response) => {
	try {
		const extractedRoutes = extractRouteFromPath(request.path)
		const backendResponse = await twilioRouteHandler.handleRequest(extractedRoutes, request.body);

		response.send(backendResponse);
		
	} catch(exception){
		response.status(400).send(exception.message);
	}
})

app.post('/sessions/*', async (request, response) => {
	try {
		const extractedRoutes = extractRouteFromPath(request.path)
		const backendResponse = await sessionsRouteHandler.handleRequest(extractedRoutes, request.body);

		response.send(backendResponse);
		
	} catch(exception){
		response.status(400).send(exception.message);
	}
})

app.post('/payments/*', async (request, response) => {
	try {
		const extractedRoutes = extractRouteFromPath(request.path)
		const backendResponse = await paymentsRouteHandler.handleRequest(extractedRoutes, request.body);

		response.send(backendResponse);
		
	} catch(exception){
		response.status(400).send(exception.message);
	}
})

app.post('/payouts/*', async (request, response) => {
	try {
		const extractedRoutes = extractRouteFromPath(request.path)
		const backendResponse = await payoutsRouteHandler.handleRequest(extractedRoutes, request.body);

		response.send(backendResponse);
		
	} catch(exception){
		response.status(400).send(exception.message);
	}
})

app.post('/files/*', async (request, response) => {
	try {
		const extractedRoutes = extractRouteFromPath(request.path)
		const backendResponse = await filesRouteHandler.handleRequest(extractedRoutes, request.body);

		response.send(backendResponse);
		
	} catch(exception){
		response.status(400).send(exception.message);
	}
})

app.post('/webhook/*', async (request, response) => {
	const extractedRoutes = extractRouteFromPath(request.path)
	const backendResponse = await webhookRouteHandler.handleRequest(extractedRoutes, request.body);

  response.status(200).send("Ok");
});

app.use(errorHandler);

httpServer.listen(PORT, async () => {
	const Global = await new Global_();

	userRouteHandler = new UserRouteHandler(Global)
	dashboardRouteHandler = new DashboardRouteHandler(Global)
	twilioRouteHandler = new TwilioRouteHandler(Global)
	sessionsRouteHandler = new SessionsRouteHandler(Global)
	paymentsRouteHandler = new PaymentsRouteHandler(Global)
	payoutsRouteHandler = new PayoutsRouteHandler(Global)
	filesRouteHandler = new FilesRouteHandler(Global)
	webhookRouteHandler = new WebhookRouteHandler(Global)
	console.log(`Listening on port ${PORT}`);
});
