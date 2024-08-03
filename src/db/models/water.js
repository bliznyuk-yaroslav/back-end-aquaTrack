import { Schema, model } from "mongoose";

import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const waterSchema = new Schema(
    {
        amountOfWater: {
            type: Number,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: new Date(),
        },
        dailyNorma: {
            type: Number,
            default: 1.5,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        monthWater: {
            type: Number,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

waterSchema.post('save', mongooseSaveError);

waterSchema.pre('findOneAndUpdate', setUpdateSettings);

waterSchema.post('findOneAndUpdate', mongooseSaveError);

export const WaterCollection = model('water', waterSchema);
