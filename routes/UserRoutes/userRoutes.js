const express = require('express')
const router = express.Router()
const userController = require('../../controllers/User/userController')
const { verifyToken, googleVerify } = require('../../Middlewares/auth')

//user
router.post('/signup', userController.userSignup)
router.post('/login', userController.userLogin)
router.post('/otpLogin', userController.otpLogin)
router.get('/googleLogin', googleVerify, userController.googleLogin)
router.put('/profile', verifyToken, userController.profile)
router.post('/profilePicture', verifyToken, userController.profilePicture)
router.get('/allDistricts', verifyToken, userController.allDistricts)
router.get('/districtChoose', verifyToken, userController.districtChoose)
router.get('/totalUnits', verifyToken, userController.totalUnits)
router.get('/sameBloodGroup', verifyToken, userController.sameBloodGroup)
router.get('/otherBloodGroup', verifyToken, userController.otherBloodGroup)


module.exports = router;
