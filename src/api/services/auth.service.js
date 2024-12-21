const bcrypt = require('bcrypt');
const {User} = require("../models");
const httpStatus = require("http-status");
const cacheService = require('../utils/kafka');
const {userCacheKey, ROLES, serverError} = require("../utils/texts");
const {abort, abortUnless} = require("../utils/requests/ApiResponder");
const {omitObject} = require("../utils/helpers");
const {generateToken} = require("../utils/security/tokens.utils");

const register = async (req) => {
    const {name, username, phone, password} = req.body;
    let {email} = req.body;
    email = email.toLowerCase();

    let user;
    let newPassword = bcrypt.hashSync(password, 10);
    try {
        user = await User.create({name, username, email, phone, password: newPassword, role: ROLES[2]});
        user = user.get();
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeUniqueConstraintError')
            abort(httpStatus.CONFLICT, `User already exist, proceed to login!`);
        else abort(httpStatus.BAD_REQUEST, `${serverError}`);
    }
    await cacheService.set(userCacheKey(email), user);
    return {
        token: generateToken(user.id, user.role, email),
        ...omitObject("password", user)};
}

const loginUser = async (req) => {
    const {email, password} = req.body;
    const user = await cacheService.getOrUpdate(userCacheKey(email), async () => await User.findOne({
        where: {email}, raw: true
    }));
    abortUnless(user, httpStatus.BAD_REQUEST, 'Wrong credentials');
    const rightPassword = bcrypt.compareSync(password, user.password);
    abortUnless(rightPassword, httpStatus.BAD_REQUEST, 'Wrong credentials');
    return {
        token: generateToken(user.id, user.role, email),
        ...omitObject("password", user)
    };
};

module.exports = {
    register,
    loginUser,
}