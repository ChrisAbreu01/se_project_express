const INVALID_DATA = {
  status: "BadRequest",
  error: 400,
};

const NOTFOUND = {
  status: "NotFound",
  error: 404,
};

const DEFAULT = {
  status: "InternalServerError",
  error: 500,
};
const UNAUTHORIZED = {
  status: "Unauthorized",
  error: 401,
};
const FORBIDDEN = {
  status: "Forbidden",
  error: 403,
};
const ALREADYEXISTSERROR = {
  status: "AlreadyExistsError",
  error: 409,
};
const OK = {
  status: " ok",
  code: 200,
};

module.exports = {
  INVALID_DATA,
  NOTFOUND,
  DEFAULT,
  OK,
  UNAUTHORIZED,
  FORBIDDEN,
  ALREADYEXISTSERROR,
};
