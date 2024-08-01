import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import { hashValue, compareHash } from "../utils/hash.js";
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from '../constant/index.js';

export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) {
        throw createHttpError(409, "Email in use");
    }
    const encryptedPassword = await hashValue(payload.password);

    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    const isEqual = await compareHash(payload.password, user.password);
    if (!isEqual) {
        throw createHttpError(401, "Unauthorized");
    }

    await SessionsCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');

    const refreshToken = randomBytes(30).toString('base64');

    return await SessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
    });

};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};
