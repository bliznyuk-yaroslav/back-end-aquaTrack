import { Schema, model } from "mongoose";

const waterSchema = new Schema(
    {
        amountOfWater: {
            type: Number,
            required: true,
        },
        dailyNorma: {
            type: Number,
            default: 1.5,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        monthWater: {
            type: Number,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const WaterCollection = model('water', waterSchema);