import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
// import { of } from 'rxjs/observable/of';
// import { mergeMap, catchError } from 'rxjs/operators';

require('mongoose').Promise = require('bluebird');

export class UniversityClass extends Typegoose {
	@prop({ required: true }) _id: mongoose.Types.ObjectId;
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

// TODO: Use this as the basis of a class template TypegooseModelService<T> that implements these methods:
// - connectToDatabase
// - disconnectFromDatabase
// - findByCriteria
// - findByKeyAndValue
// - findOneByKeyAndValue
// - findOne
// - findAll
// - findById

export class UniversityService {
	connectToDatabase(): Observable<any> {
		return Observable.create(observer => {
			const url = 'mongodb://localhost:27017/virginia-tech-20170810';
			const options = {
				useMongoClient: true
			};

			mongoose.connect(url, options)
				.then(() => {
					console.log('Connected to the database.');
					observer.next(undefined);
					observer.complete();
				})
				.catch(error => {
					console.error('Error: Failed to connect to the database:', error);
					observer.error(error);
				});
		});
	 }

	disconnectFromDatabase(): Observable<any> {
		return Observable.create(observer => {
			mongoose.disconnect()
				.then(() => {
					console.log('Disconnected from the database.');
					observer.next(undefined);
					observer.complete();
				})
				.catch(error => {
					console.error('Error: Failed to disconnect from the database:', error);
					observer.error(error);
				});
		});
	}

	// TomW 2018-02-22 : UniversityModel.find({ key }) works when the key is a string, but not when it is a number.
	// E.g. This works:			return fromPromise(UniversityModel.find({ shortName: 'Virginia Tech' }));
	// But this does not work:	return fromPromise(UniversityModel.find({ numUndergraduateStudents: 24191 }));

	findByCriteria(criteria: any): Observable<University[]> {
		return fromPromise(UniversityModel.find(criteria));
	}

	findByKeyAndValue(key: string, value: any): Observable<University[]> {
		return this.findByCriteria({ $expr: { $eq: [ "$" + key, value.toString() ] } });
	}

	findOneByKeyAndValue(key: string, value: any): Observable<University> {
		return this.findByKeyAndValue(key, value)
			.switchMap(universities => {
				return Observable.of(universities.shift());
			});
	}

	findOne(): Observable<University> {
		return fromPromise(UniversityModel.findOne());
	}

	findAll(): Observable<University[]> {
		return fromPromise(UniversityModel.find());
	}

	findById(id: number): Observable<University> {
		return this.findAll()
			.switchMap(universities => {
				// The default return value of Array.find() is undefined, not null.
				return Observable.of(universities.find(university => university.id === id));
			});
	}
}

// **** Test ****

let universityService = new UniversityService();

universityService.connectToDatabase()
	.switchMap(() => {
		return universityService.findOne();
	})
	.switchMap(university => {
		console.log();
		console.log('findOne() : University:', university);
		
		if (university) {
			console.log('University Id:', university.id);
			console.log('University name:', university.name);
			console.log('University short name:', university.shortName);
		}

		return universityService.findAll();
	})
	.switchMap(universities => {
		console.log();
		console.log('findAll() : Universities: ', universities);
		console.log('Number of universities: ', universities.length);
		return universityService.findById(3);
	})
	.switchMap(university => {
		console.log();
		console.log('findById(3) : University:', university);
		
		if (university) {
			console.log('University Id:', university.id);
			console.log('University name:', university.name);
			console.log('University short name:', university.shortName);
		}

		return universityService.findByCriteria({ shortName: 'Virginia Tech' });
	})
	.switchMap(universities => {
		console.log();
		console.log('findByCriteria(shortName) : Found', universities.length, 'result(s).');
		
		if (universities.length > 0) {
			let university = universities[0];

			console.log('University Id:', university.id);
			console.log('University name:', university.name);
			console.log('University short name:', university.shortName);
		}
		
		const key: string = 'shortName';
		const value: string = 'Virginia Tech';
		
		return universityService.findByKeyAndValue(key, value);
	})
	.switchMap(universities => {
		console.log();
		console.log('findByKeyAndValue(shortName) : Found', universities.length, 'result(s).');
		
		if (universities.length > 0) {
			let university = universities[0];

			console.log('University Id:', university.id);
			console.log('University name:', university.name);
			console.log('University short name:', university.shortName);
		}
		
		const key: string = 'numUndergraduateStudents';
		const value: number = 24191;
		
		return universityService.findByKeyAndValue(key, value);
	})
	.switchMap(universities => {
		console.log();
		console.log('findByKeyAndValue(numUndergraduateStudents) : Found', universities.length, 'result(s).');
		
		if (universities.length > 0) {
			let university = universities[0];

			console.log('University Id:', university.id);
			console.log('University name:', university.name);
			console.log('University short name:', university.shortName);
		}
		
		const key: string = 'numUndergraduateStudents';
		const value: number = 24191;
		
		return universityService.findOneByKeyAndValue(key, value);
	})
	.switchMap(university => {
		console.log();
		console.log('findOneByKeyAndValue(numUndergraduateStudents) : University:', university);
		
		if (university) {
			console.log('University Id:', university.id);
			console.log('University name:', university.name);
			console.log('University short name:', university.shortName);
		}

		console.log();
		return universityService.disconnectFromDatabase();
	})
	// Observable.subscribe(onNext, onError, onCompleted) ; see http://reactivex.io/documentation/operators/subscribe.html
	.subscribe(
		() => {
			console.log();
			console.log('subscribe() : onNext()');
		},
		error => {
			console.error('subscribe() : Caught an error:', error);
		},
		() => {
			console.log('subscribe() : onCompleted()');
		}
	);
