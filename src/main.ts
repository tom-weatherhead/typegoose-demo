// Mostly from http://codingsans.com/blog/mongoose-models-using-typescript-classes

// To build and run:

// $ rm -f dist/*
// $ tsc
// $ node dist/main.js

import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

require('mongoose').Promise = require('bluebird');

const options = {
  useMongoClient: true
};

mongoose.connect('mongodb://localhost:27017/typegoosetest', options);

class User extends Typegoose {
  @prop()
  name?: string;
}

const UserModel = new User().getModelForClass(User);

(async () => {
  const u = new UserModel({ name: 'JohnDoe' });
  await u.save();
  const user = await UserModel.findOne();
  console.log(user); // { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
  mongoose.disconnect();
})();
