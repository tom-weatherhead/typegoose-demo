import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

require('mongoose').Promise = require('bluebird');

const options = {
  useMongoClient: true
};

mongoose.connect('mongodb://localhost:27017/virginia-tech-20170810', options);

class Institution extends Typegoose {
  @prop()
  // id?: ;
  _id?: number;

  @prop()
  'Institution Id'?: number;

  @prop()
  name?: string;

  @prop()
  shortName?: string;

  @prop()
  City?: string;

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

  @prop()
  funk?: number;
}

const InstitutionModel = new Institution().getModelForClass(Institution);

(async () => {
  const institution = await InstitutionModel.findOne();
  console.log(institution);
  console.log('Institution Id:', institution['Institution Id']);
  console.log('City:', institution['City']);
  console.log('City:', institution.City);
  mongoose.disconnect();
})();
  