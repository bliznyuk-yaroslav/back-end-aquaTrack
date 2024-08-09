import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from '../services/auth.js';
import { REFRESH_TOKEN_LIFETIME } from '../constant/index.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res, next) => {
  try {
    const { newUser, accessToken } = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'User successfully registered!',
      data: {
        name: newUser.name,
        email: newUser.email,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const setupSession = (res, session) => {
 res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  res.cookie('sessionId', session._id || session.userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};

export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);
    setupSession(res, session);

    res.json({
      status: 200,
      message: 'User successfully logged in!',
      data: {
        accessToken: session.accessToken,
        userId: session.userId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) {
      await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    if (!sessionId || !refreshToken) {
      return next(createHttpError(400, 'Invalid session'));
    }

    const session = await refreshUsersSession({ sessionId, refreshToken });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
