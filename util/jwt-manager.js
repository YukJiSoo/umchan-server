const jwt = require('jsonwebtoken');

const TOKEN_SECRET_KEY = require('../config/secret-config.json')['jwt-secret'];

module.exports.tokenCreator = (data) => new Promise((resolve, reject) => {
    jwt.sign(data, TOKEN_SECRET_KEY,
        { expiresIn: '7d', issuer: 'umchan', subject: 'user' },
        (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
});
