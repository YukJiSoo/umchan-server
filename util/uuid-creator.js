const uuidv4 = require('uuid/v4');

module.exports = () => {
    const tokens = uuidv4().split('-');
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};
