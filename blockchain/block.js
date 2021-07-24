const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');
const hexToBinary = require('hex-to-binary');

class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        }
        //  Difficulty is based on binary version of hash
        while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({timestamp,lastHash,data,difficulty,nonce,hash});
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        // Lower limit of 1
        if (difficulty < 1) return 1;

        if ((timestamp - originalBlock.timestamp) > MINE_RATE) {
            // if mine time is greater than the mine rate
            // but decreasing the difficulty would go below the lowest difficulty (1)
            // set the difficulty to 1
            if ((difficulty - 1) >= 1) return difficulty - 1;
            return 1;
        }


        return difficulty + 1;
    }
}

module.exports = Block;