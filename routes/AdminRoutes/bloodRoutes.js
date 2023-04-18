const express = require('express')
const router = express.Router()
const bloodController = require('../../controllers/Admin/bloodController')

router.get('/getAvailableUnits', bloodController.getAvailableUnits)
router.get('/getTransfusion', bloodController.getTransfusion)
router.get('/getDonations', bloodController.getDonations)


module.exports = router;