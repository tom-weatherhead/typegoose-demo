import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

import { Observable } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
// import { mergeMap, catchError } from 'rxjs/operators';

require('mongoose').Promise = require('bluebird');

export class UniversityClass extends Typegoose {
  @prop({ required: true, index: true, unique: true }) id: number;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  shortName: string;

  @prop({ required: true }) numUndergraduateStudents: number;

  @prop({ required: true })
  percentWhite: number;

  @prop({ required: true })
  percentBlack: number;

  @prop({ required: true })
  percentHispanic: number;

  @prop({ required: true })
  percentAsian: number;

  @prop({ required: true })
  percentAmericanNative: number;

  @prop({ required: true })
  percentPacificIslander: number;

  @prop({ required: true })
  percentMultipleRaces: number;

  @prop({ required: true })
  percentNonResidentAlien: number;

  @prop({ required: true })
  percentUnknown: number;
}

const UniversityModel = new UniversityClass().getModelForClass(UniversityClass, { schemaOptions: { collection: 'universities' } });

export type University = InstanceType<UniversityClass>;

export class UniversityService {
	connectToDatabase(): void {
		const url = 'mongodb://localhost:27017/virginia-tech-20170810';
		const options = {
			useMongoClient: true
		};

		mongoose.connect(url, options);
	}

	/*
	findOneTest(id: number): void {
		this.connectToDatabase();
		//UniversityModel.find({ 'id': Number(id) })
		//UniversityModel.find({ _id: Number(5a8dac8d585286071c085ccf) })

		// UniversityModel.find({ 'numUndergraduateStudents': 24191 })
			// .then(result => {
				// console.log('findOneTest() result:', result);
				// mongoose.disconnect();
			// }, error => {
				// console.error('findOneTest() error:', error);
				// mongoose.disconnect();
			// });
		UniversityModel.find({ numUndergraduateStudents: 24191 }, result => {
			console.log('findOneTest() result:', result);
			mongoose.disconnect();
		});
	}
	*/

	findOne(): Observable<University> {
		// this.connectToDatabase();
		return fromPromise(UniversityModel.findOne())
			.switchMap(university => {
				//console.log('findOne() test: Result is', university);
				// mongoose.disconnect();
				return Observable.of(university);
			}).catch(error => {
				// mongoose.disconnect();
				return Observable.throw(error);
			});
	}

	findAll(): Observable<University[]> {
		// this.connectToDatabase();
		return fromPromise(UniversityModel.find())
			.switchMap((universities: University[]) => {
				// mongoose.disconnect();
				return Observable.of(universities);
				// return fromPromise(mongoose.disconnect())
					// .switchMap(() => {
						// return Observable.of(universities);
					// });
			}).catch(error => {
				// mongoose.disconnect();
				return Observable.throw(error);
				// return fromPromise(mongoose.disconnect())
					// .switchMap(() => {
						// return Observable.throw(error);
					// });
			});
	}

	findById(id: number): Observable<University> {
		return this.findAll()
			.switchMap(universities => {
				//console.log('universities:', universities);
				let filteredUniversities = universities.filter(university => university.id === id);
				//console.log('filteredUniversities:', filteredUniversities);
				return Observable.of(filteredUniversities.length > 0 ? filteredUniversities[0] : null);
			});
	}
}

// **** Test ****

let universityService = new UniversityService();

/*
universityService.findOne().subscribe(university => {
	// console.log('University:', university);
	// console.log('University Id:', university.id);
	// console.log('University name:', university.name);
	// console.log('University short name:', university.shortName);
});

universityService.findAll().subscribe(universities => {
	console.log();
	console.log('Universities: ', universities);
	console.log('Number of universities: ', universities.length);
});
	
//universityService.findOneTest(3);
universityService.findById(3).subscribe(university => {
	console.log();
	console.log('University:', university);
	console.log('University Id:', university.id);
	console.log('University name:', university.name);
	console.log('University short name:', university.shortName);
});
*/

// ****

universityService.connectToDatabase();

let subscription1 = universityService.findOne().subscribe(university => {
	subscription1.unsubscribe();
	// console.log('University:', university);
	// console.log('University Id:', university.id);
	// console.log('University name:', university.name);
	// console.log('University short name:', university.shortName);

	let subscription2 = universityService.findAll().subscribe(universities => {
		subscription2.unsubscribe();
		console.log();
		console.log('Universities: ', universities);
		console.log('Number of universities: ', universities.length);
		
		//universityService.findOneTest(3);
		let subscription3 = universityService.findById(3).subscribe(university => {
			subscription3.unsubscribe();
			console.log();
			console.log('University:', university);
			console.log('University Id:', university.id);
			console.log('University name:', university.name);
			console.log('University short name:', university.shortName);
			mongoose.disconnect()	// This actually returns a Promise.
				.then(() => {
					console.log('mongoose.disconnect() : Resolved.');
				});
		});
	});
});
