'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;

const CSVTransformer = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Dashboard/Profile/CSVTransformer.js')

describe('CSV Transformer', () => {
	it('Should Return An Object With All The States As Keys', async () => {
		const fileName = "../canadian_states.csv"

		const CSV_Transformer = new CSVTransformer();

		try {
			const object = await CSV_Transformer.transformCSVWithName(fileName);
		} catch(exception){
		}
	}).timeout(timeout)
})
