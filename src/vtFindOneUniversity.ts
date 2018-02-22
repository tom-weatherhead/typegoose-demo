import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

require('mongoose').Promise = require('bluebird');

const options = {
  useMongoClient: true
};

// mongoose.connect('mongodb://localhost:27017/virginia-tech-20170810', options);

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
  mongoose.connect('mongodb://localhost:27017/virginia-tech-20170810', options);

  const university = await UniversityModel.findOne();
  console.log('University:', university);
  console.log('University Id:', university.id);
  console.log('University name:', university.name);
  console.log('University short name:', university.shortName);
  //console.log('City:', university['City']);
  //console.log('City:', university.City);
  mongoose.disconnect();
})();
  