
const generateOtp = (length = 50) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }

    return result;
}

const generateOtpDigit = () => {
    const charset = '0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }

    return result;
}

const omitObject = (key, obj) => {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}

const paginateOptions = (req) => {
    if (req.query.export) return { limit: Number.MAX_SAFE_INTEGER, offset: 0 };
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 12;
    return {
        limit: perPage,
        offset: (page - 1) * perPage,
    };
};

const dateFormatter = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const isDev = () => {
    return process.env.NODE_ENVIRONMENT === "development";
}

module.exports = {
    isDev,
    omitObject,
    generateOtp,
    dateFormatter,
    paginateOptions,
    generateOtpDigit,
}