const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');

const resolve = async (fetchFn, external = false) => {
    let res;
    try {
        res = await fetchFn();
    } catch (e) {
        console.error(e);
        throw new ApiError(httpStatus.HTTP_STATUS_FAILED_DEPENDENCY, 'Unable to connect to service');
    }

    if (res) {
        let data = {};
        try {
            data = res.data;
        } catch (e) {
            // Invalid JSON or no response content
        }

        // Success
        if (`${res.status}`.startsWith('2')) {
            return external ? data : data.data;
        }

        // Log errors
        console.error('Error Response', res);
        console.error('Error Data', data);

        // Avoid returning 401 errors, convert to 424
        if (res.status === httpStatus.HTTP_STATUS_UNAUTHORIZED) {
            throw new ApiError(httpStatus.HTTP_STATUS_FAILED_DEPENDENCY, data.message || `Connection rejected: unauthorized`);
        }

        // 5XX errors
        if (`${res.status}`.startsWith('5')) {
            throw new ApiError(res.status, data.message || `Service experienced an error`);
        }

        throw new ApiError(res.status, data.message || data.reason);
    } else {
        // No response at all
        throw new ApiError(httpStatus.HTTP_STATUS_FAILED_DEPENDENCY, 'No response from service');
    }
};

const fetch = async (method, url, data, headers = {}, external = false) => {
    let absoluteUrl = url;
    const nHeaders = { 'Content-Type': 'application/json', ...headers };
    if (!external) {
        // Fix authorization
        if (!nHeaders.Authorization) {
            const token = await generateServiceAuthToken();
            nHeaders.Authorization = `Bearer ${token.access.token}`;
        }

        // Fix url
        if (!absoluteUrl.startsWith('http')) {
            const noSlash = absoluteUrl.replace(/^\/+|\/+$/g, '');
            absoluteUrl = `${process.env.BASE_URL}/${noSlash}`;
        }
    }
    return resolve(
        async () =>
            axios({
                method,
                url: absoluteUrl,
                headers: nHeaders,
                data: data || null,
            }),
        external
    );
};

/**
 * GET an external API
 * @param url
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXGET = async (url, headers) => {
    return fetch('GET', url, null, headers, true);
};

const fetchXPOST = async (url, data, headers) => {
    // if (isTest()) return;
    return fetch('POST', url, data, headers, true);
};

const fetchXPATCH = async (url, data, headers) => {
    return fetch('PATCH', url, data, headers, true);
};

const fetchXPUT = async (url, data, headers) => {
    return fetch('PUT', url, data, headers, true);
};

const fetchXDELETE = async (url, headers) => {
    return fetch('DELETE', url, null, headers, true);
};

module.exports = {
    fetch,
    fetchXGET,
    fetchXPOST,
    fetchXPUT,
    fetchXPATCH,
    fetchXDELETE,
};
