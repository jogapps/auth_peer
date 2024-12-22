const { Op } = require("sequelize");
const {Friend, User, sequelize} = require("../models");
const cacheService = require("../utils/kafka");
const {userCacheIdKey, friendCacheKey, serverError, REQUEST_STATUS} = require("../utils/texts");
const {abortUnless, abortIf} = require("../utils/requests/ApiResponder");
const httpStatus = require("http-status");

const getRecommendations = async (req) => {
    const { id: user_id } = req.data;

    return User.findAndCountAll({
        where: {
            [Op.and]: [
                { id: { [Op.ne]: user_id } },
                {
                    id: {
                        [Op.notIn]: sequelize.literal(`(
                            SELECT DISTINCT friend_id
                            FROM "Friends" 
                            WHERE user_id = '${user_id}'
                        )`),
                    },
                },
            ],
        },
        attributes: ['id', 'name', 'email', 'phone', 'username'],
    });
};

const getPendingRequest = async (req) => {
    const {id: user_id} = req.data;
    return Friend.findAndCountAll({
        where: { user_id, status: REQUEST_STATUS[0] }
    });
}

const getApprovedRequest = async (req) => {
    const {id: user_id} = req.data;
    return Friend.findAndCountAll({
        where: { user_id, status: REQUEST_STATUS[1] }
    });
}

const cancelRequest = async (req) => {
    const {friend_id} = req.body;
    const {id: user_id} = req.data;
    const requestExist = await cacheService.getOrUpdate(`${user_id}_${friendCacheKey(friend_id)}`, async () => await Friend.findOne({
        where: {user_id, friend_id}, raw: true
    }));
    abortUnless(requestExist, httpStatus.CONFLICT, 'No request found for this user');
    await cacheService.remove(friendCacheKey(friend_id));
    const destroyedRequest = await Friend.destroy({where: {user_id, friend_id}});
    abortUnless(destroyedRequest, httpStatus.INTERNAL_SERVER_ERROR, `${serverError}`);
    await cacheService.remove(`${user_id}_${friendCacheKey(friend_id)}`);
    return destroyedRequest;
}

const sendRequest = async (req) => {
    const {friend_id} = req.body;
    const {id: user_id} = req.data;

    const friend = await cacheService.getOrUpdate(userCacheIdKey(friend_id), async () => await User.findOne({
        where: {id: friend_id}, raw: true
    }));
    abortUnless(friend, httpStatus.BAD_REQUEST, 'Invalid Friend');
    const requestExist = await cacheService.getOrUpdate(`${user_id}_${friendCacheKey(friend_id)}`, async () => await Friend.findOne({
        where: {user_id, friend_id}, raw: true
    }));
    abortIf(requestExist, httpStatus.CONFLICT, 'Request already sent');
    const sentRequest = await Friend.create({user_id, friend_id});
    abortUnless(sentRequest, httpStatus.INTERNAL_SERVER_ERROR, 'Error adding friends');
    return sentRequest;
};

const approveRequest = async (req) => {
    const {friend_id} = req.body;
    const {id: user_id} = req.data;
    // const requestExist = await cacheService.getOrUpdate(`${user_id}_${friendCacheKey(friend_id)}`, async () => await Friend.findOne({
    //     where: {user_id, friend_id}, raw: true
    // }));
    // abortUnless(requestExist, httpStatus.BAD_REQUEST, 'Invalid Request');
    const updateRequest = await Friend.update({status: REQUEST_STATUS[1]}, {where: {user_id, friend_id}});
    abortUnless(updateRequest, httpStatus.INTERNAL_SERVER_ERROR, `${serverError}`);
    await cacheService.remove(`${user_id}_${friendCacheKey(friend_id)}`);
    return updateRequest;
}

module.exports = {
    sendRequest,
    cancelRequest,
    approveRequest,
    getPendingRequest,
    getApprovedRequest,
    getRecommendations,
}