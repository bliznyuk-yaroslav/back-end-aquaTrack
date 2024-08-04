import { registerUser, loginUser, logoutUser, refreshUsersSession } from "../services/auth.js";
import { REFRESH_TOKEN_LIFETIME } from '../constant/index.js';

export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    const data = {
      name: user.name,
      email: user.email,
      accessToken: user.accessToken,
      userId: user._id, // додаємо userId
    };
    res.status(201).json({
      status: 201,
      message: "User successfully registered!",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  res.json({
    status: 200,
    message: 'User successfully logged in!',
    data: {
      accessToken: session.accessToken,
      userId: session.userId,  // додаємо userId
    },
  });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
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
