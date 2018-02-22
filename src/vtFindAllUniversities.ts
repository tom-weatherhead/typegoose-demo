import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

require('mongoose').Promise = require('bluebird');

const options = {
  useMongoClient: true
};

mongoose.connect('mongodb://localhost:27017/virginia-tech-20170810', options);

class University extends Typegoose {
  @prop()
  id?: number;

  @prop()
  name?: string;

  @prop()
  shortName?: string;

  @prop()
  numUndergraduateStudents?: number;

  @prop()
  percentWhite?: number;

  @prop()
  percentBlack?: number;

  @prop()
  percentHispanic?: number;

  @prop()
  percentAsian?: number;

  @prop()
  percentAmericanNative?: number;

  @prop()
  percentPacificIslander?: number;

  @prop()
  percentMultipleRaces?: number;

  @prop()
  percentNonResidentAlien?: number;

  @prop()
  percentUnknown?: number;
}

const UniversityModel = new University().getModelForClass(University);

(async () => {
  const universities = await UniversityModel.find(); // UniversityModel.find() returns a Promise. So:
  // UniversityModel.find()
	// .then(universities => {
		// return Observable.of(universities);
	// }).catch(error => {
		// console.error(error);
		// return Observable.throw(...);
	// });

  console.log('Universities: ', universities);
  console.log('Number of universities: ', universities.length);
  mongoose.disconnect();
})();

// See also https://www.npmjs.com/package/mongoose-observables
// See also http://www.maxofeden.com/2016/09/15/RxJS-with-Mongoose-and-TypeScript/
