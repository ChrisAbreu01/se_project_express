const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { INVALID_DATA } = require("../utils/errors");

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            res
                .status(INVALID_DATA.error)
                .send({ message: "Authorization not granted" });
            return;
        }

        const token = authorization.replace("Bearer ", "");
        let payload;

        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            res
                .status(INVALID_DATA.error)
                .send({ message: "Authorization not granted" });
            return;
        }
        req.user = payload;
        next();
    } catch (err) {
        res
            .status(INVALID_DATA.error)
            .send({ message: "Authorization not granted" });
    }
};