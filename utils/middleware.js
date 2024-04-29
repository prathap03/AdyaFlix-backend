const jwt = require('jsonwebtoken');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const JWT_SECRET = process.env.JWT_SECRET;


const createToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, {
        expiresIn: '15m',
    });
}


module.exports = createToken

