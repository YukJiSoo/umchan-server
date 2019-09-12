/* eslint-disable no-restricted-globals */
const { ERR_MESSAGE } = require('../../constants');

module.exports = (location) => {
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
        return { success: false, message: ERR_MESSAGE.LOCATION_NOT_NUMBER };
    }

    return { success: true };
};
