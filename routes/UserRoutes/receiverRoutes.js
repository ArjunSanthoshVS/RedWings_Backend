const express = require('express')
const router = express.Router()
const {verifyToken} = require('../../Middlewares/auth')
const receiverController = require('../../controllers/User/Receiver/receiverController')


//receivers
router.post('/request', verifyToken, receiverController.request)
router.get('/transfusion_history', verifyToken, receiverController.transfusion_history)
router.put('/cancel/:id', verifyToken, receiverController.cancel)
router.get('/totalReceivers', verifyToken, receiverController.totalReceivers)
router.get('/totalRequests', verifyToken, receiverController.totalRequests)
router.get('/pendingRequests', verifyToken, receiverController.pendingRequests)
router.get('/approvedRequests', verifyToken, receiverController.approvedRequests)
router.get('/rejectedRequests', verifyToken, receiverController.rejectedRequests)

module.exports = router;
