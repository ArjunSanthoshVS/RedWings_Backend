const express = require('express')
const router = express.Router()
const donorController = require('../../controllers/User/Donor/donorController')
const { verifyToken } = require('../../Middlewares/auth')

//donor
router.post('/donate', verifyToken, donorController.donate)
router.get('/donation_history', verifyToken, donorController.donation_history)
router.get('/pateintDetails', verifyToken, donorController.pateintDetails)
router.get('/transfusionDistricts', verifyToken, donorController.transfusionDistricts)
router.get('/getBranches', verifyToken, donorController.getBranches)
router.get('/totalDonors', verifyToken, donorController.totalDonors)

module.exports = router;
