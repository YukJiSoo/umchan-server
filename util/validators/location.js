/* eslint-disable no-restricted-globals */
const { ERROR } = require('../../constants');

module.exports = (location) => {
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
        return { success: false, error: ERROR.LOCATION_NOT_NUMBER };
    }

    return { success: true };
};
