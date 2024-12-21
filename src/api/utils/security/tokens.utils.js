const JWT = require("jsonwebtoken");
const jwtUtils = require("./jwt.utils");

const generateToken = (userId, role, email, approved = false) => {

    const payload = {
        id: userId,
        role,
        email,
        approved,
    };

    const options = {
        algorithm: jwtUtils.algorithm, 
        expiresIn: Math.floor(Date.now() / 1000) + parseInt(jwtUtils.expiresIn),   
        issuer: jwtUtils.issuer, 
        audience: jwtUtils.audience
      };

    let token = JWT.sign(payload, jwtUtils.secret, options);
    return token;
}

module.exports = { generateToken };