const REDIS_EXPIRY_DAILY = 60 * 60 * 24;

const ROLES = ['admin', 'sub_admin', 'user'];

const serverError = "Server error!";
const payloadError = "Invalid payload!";
const createdSuccess = "created Successfully!";
const updatedSuccess = "updated successfully!";
const fetchedSuccess = "fetched successfully!";
const deletedSuccess = "deleted successfully!";
const modifiedSuccess = "modified successfully!";
const restoredSuccess = "restored successfully!";
const activatedSuccess = "Activated successfully!";

const userCacheKey = (key) => `user_${key}`;

module.exports = {
    ROLES,
    serverError,
    payloadError,
    userCacheKey,
    createdSuccess,
    updatedSuccess,
    deletedSuccess,
    fetchedSuccess,
    modifiedSuccess,
    restoredSuccess,
    activatedSuccess,
    REDIS_EXPIRY_DAILY,
}