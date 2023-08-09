/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
const UnauthorizedError = require("../errorConstructors/unauthorizedError");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new UnauthorizedError("You are not authorized"));
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return next(new UnauthorizedError("You are not authorized"));
    }
    req.user = payload;
    next();
  } catch (err) {
    return next(new UnauthorizedError("You are not authorized"));
  }
};
