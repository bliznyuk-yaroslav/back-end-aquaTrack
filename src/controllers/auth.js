import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from '../services/auth.js';
import { REFRESH_TOKEN_LIFETIME } from '../constant/index.js';

export const registerUserController = async (req, res, next) => {
  try {
    const { newUser, accessToken } = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'User successfully registered!',
      data: {
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
  res.cookie('sessionId', session.userId, {
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
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
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
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

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
