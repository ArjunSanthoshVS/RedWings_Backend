const express = require('express')
require('dotenv').config()
const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET)
const router = express.Router()
const { Payment } = require('../../models/User/payment')
const { verifyToken } = require('../../Middlewares/auth')
const userController = require('../../controllers/User/userController')
const adminController = require('../../controllers/Admin/adminController')

router.post('/donate_money', async (req, res) => {
    const amount = Number(req.body.amount);
    const userId = req.body.userId;
    const userName = req.body.userName;
    const createdAt = req.body.createdAt;

    // Create a new Payment instance
    const payment = new Payment({
        amount: amount,
        userId: userId,
        userName: userName,
        createdAt: createdAt
    });

    try {
        await payment.save()
    } catch (error) {
        res.status(500).send({ message: "Not saved in database" })
    }
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: req.body.userName,
                        description: 'Donation for a good cause',
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/other_donation',
    });
    res.send({ url: session.url });
});

router.get('/paymentDetails', verifyToken, userController.paymentDetails)
router.get('/fullPaymentDetails', verifyToken, adminController.fullPaymentDetails)

module.exports = router;