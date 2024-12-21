module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN, 
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    algorithm: process.env.JWT_ALGORITHM
}