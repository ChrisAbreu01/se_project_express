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

module.exports = {
  INVALID_DATA,
  NOTFOUND,
  DEFAULT,
};
