const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../Middlewares/auth');
const chatController = require('../../controllers/User/chatController');

//donor
router.get('/allContacts', verifyToken, chatController.allContacts)
router.post('/addMessage', verifyToken, chatController.addMessage)
router.post('/getAllMessage', verifyToken, chatController.getAllMessage)


module.exports = router;
