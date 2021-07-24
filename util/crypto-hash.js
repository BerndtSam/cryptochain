const crypto = require('crypto');

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    hash.update(inputs.sort().join(' '));

    // digest is a term in cryptography to represent
    // result of the hash
    return hash.digest('hex');
};

module.exports = cryptoHash;