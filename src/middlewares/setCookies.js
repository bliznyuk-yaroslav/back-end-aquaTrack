const setCookies = (req, res, next) => {
  const session = req.session;
  if (session) {
    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(session.refreshTokenValidUntil),
    });
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(session.refreshTokenValidUntil),
    });
  }
  next();
};

export default setCookies;
