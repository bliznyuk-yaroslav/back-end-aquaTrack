import {
  registerUser,
  loginUser,
  logoutUser,
  requestResetToken,
  refreshUsersSession,
} from '../services/auth.js';
import { REFRESH_TOKEN_LIFETIME } from '../constant/index.js';
import { resetPassword } from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    secury: true,
    sameSite: 'None',
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  res.cookie('sessionId', session._id || session.userId, {
    secury: true,
    sameSite: 'None',
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};

export const registerUserController = async (req, res, next) => {
  try {
    const { newUser, accessToken, sessionId, refreshToken } =
      await registerUser(req.body);

    // Налаштування сесії через кукі
    setupSession(res, { _id: sessionId, refreshToken });

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

export const refreshUserSessionController = async (req, res) => {
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
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
