require('dotenv').config()
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require("google-auth-library");
const createHttpError = require('http-errors');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization']
    if (token) {
        token = token.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, valid) => {
            if (err) {
                console.log('errrr');
                window.location = '/login'
                res.status(401).send({ result: "Please provide valid token...!" })
            } else {
                next()
            }
        })
    } else {
        console.log('iuytredfbn');
        window.location = '/login'
        res.status(403).send({ result: "Please add token with header" })
    }
}

const adminVerifyToken = (req, res, next) => {
    let token = req.headers['authorization']
    if (token) {
        token = token.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, valid) => {
            if (err) {
                console.log('errrr');
                window.location = '/admin_login'
                res.status(401).send({ result: "Please provide valid token...!" })
            } else {
                next()
            }
        })
    } else {
        console.log('iuytredfbn');
        window.location = '/admin_login'
        res.status(403).send({ result: "Please add token with header" })
    }
}

const googleVerify = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            next(createHttpError.Unauthorized())
        }
        console.log(authHeader, 'vvvvvv');
        const token = authHeader.split(' ')[1]
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.payload;
        if (payload) {
            req.userId = payload['sub']
            next()
            return 
        }
        next(createHttpError.Unauthorized())
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { verifyToken, googleVerify,adminVerifyToken }