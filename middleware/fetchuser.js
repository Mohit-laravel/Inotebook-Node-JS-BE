var jwt = require('jsonwebtoken');
const JWT_SECRET = "mysecret@key";

const fetchuser = (req, res, next) => {
    //get the user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {    
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchuser