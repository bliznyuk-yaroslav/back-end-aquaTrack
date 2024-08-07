import { model, Schema } from 'mongoose';

import { mongooseSaveError, setUpdateSettings } from './hooks.js';

import { emailRegexp, genderList } from '../../constant/index.js';

const usersSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: genderList,
      default: 'woman',
    },
    weight: {
      type: Number,
      default: 0,
    },
    activityTime: {
      type: Number,
      default: 0,
    },
    dailyNorma: {
      type: Number,
      default: 1.5,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.post('save', mongooseSaveError);

usersSchema.pre('findOneAndUpdate', setUpdateSettings);

usersSchema.post('findOneAndUpdate', mongooseSaveError);

export const UsersCollection = model('users', usersSchema);
