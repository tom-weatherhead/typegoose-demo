import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
// import { of } from 'rxjs/observable/of';
// import { mergeMap, catchError } from 'rxjs/operators';

require('mongoose').Promise = require('bluebird');

export class UniversityClass extends Typegoose {
  // @prop({ required: true, index: true, unique: true }) _id: ?;
  @prop({ required: true, index: true, unique: true }) id: number;
  @prop({ required: true }) name: string;
  @prop({ required: true }) shortName: string;
  @prop({ required: true }) numUndergraduateStudents: number;
  @prop({ required: true }) percentWhite: number;
  @prop({ required: true }) percentBlack: number;
  @prop({ required: true }) percentHispanic: number;
  @prop({ required: true }) percentAsian: number;
  @prop({ required: true }) percentAmericanNative: number;
  @prop({ required: true }) percentPacificIslander: number;
  @prop({ required: true }) percentMultipleRaces: number;
  @prop({ required: true }) percentNonResidentAlien: number;
  @prop({ required: true }) percentUnknown: number;
}

const UniversityModel = new UniversityClass().getModelForClass(UniversityClass, { schemaOptions: { collection: 'universities' } });

export type University = InstanceType<UniversityClass>;

export class UniversityService {
	connectToDatabase(): Observable<any> {
		const url = 'mongodb://localhost:27017/virginia-tech-20170810';
		const options = {
			useMongoClient: true
		};

		return fromPromise(mongoose.connect(url, options));
	}

	disconnectFromDatabase(): Observable<any> {
		return fromPromise(mongoose.disconnect());
	}

	/*
	findOneTest(id: number): Observable<University> {
		//UniversityModel.find({ 'id': Number(id) })
		//UniversityModel.find({ _id: Number(5a8dac8d585286071c085ccf) })

		// UniversityModel.find({ 'numUndergraduateStudents': 24191 })
			// .then(result => {
				// console.log('findOneTest() result:', result);
			// }, error => {
				// console.error('findOneTest() error:', error);
			// });
		return fromPromise(UniversityModel.find({ numUndergraduateStudents: 24191 }));
	}
	*/

	findOne(): Observable<University> {
		return fromPromise(UniversityModel.findOne());
	}

	findAll(): Observable<University[]> {
		return fromPromise(UniversityModel.find());
	}

	findById(id: number): Observable<University> {
		return this.findAll()
			.switchMap(universities => {
				// let filteredUniversities = universities.filter(university => university.id === id);
				// return Observable.of(filteredUniversities.length > 0 ? filteredUniversities[0] : null);
				
				// The default return value of Array.find() is undefined, not null.
				return Observable.of(universities.find(university => university.id === id));
			});
	}
}

// **** Test ****

let universityService = new UniversityService();

universityService.connectToDatabase()
	.switchMap(() => {
		console.log('Connected to the database.');
		return universityService.findOne();
	})
	.switchMap(university => {
		console.log();
		console.log('University:', university);
		console.log('University Id:', university.id);
		console.log('University name:', university.name);
		console.log('University short name:', university.shortName);
		return universityService.findAll();
	})
	.switchMap(universities => {
		console.log();
		console.log('Universities: ', universities);
		console.log('Number of universities: ', universities.length);
		return universityService.findById(3);
	})
	.switchMap(university => {
		console.log();
		console.log('University:', university);
		console.log('University Id:', university.id);
		console.log('University name:', university.name);
		console.log('University short name:', university.shortName);
		return universityService.disconnectFromDatabase();
	})
	.switchMap(() => {
		console.log();
		console.log('Disconnected from the database.');
	});
