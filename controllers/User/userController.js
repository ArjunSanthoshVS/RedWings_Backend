const { User } = require("../../models/User/user");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config()
const { validateSignup, validatelogin } = require("../../validation/loginValidation");
const multer = require('multer')
const { Branches } = require("../../models/Admin/Branches");
const { Donations } = require("../../models/Admin/donations");
const { Requests } = require("../../models/Admin/requests");
const { Payment } = require("../../models/User/payment");


module.exports = {

    userSignup: async (req, res, next) => {
        try {
            const { error } = validateSignup(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message })
            }

            const isExisting = await User.findOne({ email: req.body.email })
            if (isExisting) {
                return res.status(409).send({ message: "User with given email already Exist!" });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10)


            const newUser = await User.create({ ...req.body, password: hashedPassword })


            const token = jwt.sign({ email: newUser.email, id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: "10h" })
            return res.status(201).json({ newUser, token })
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    },

    googleLogin: async (req, res) => {
        try {
            const data = req.headers.authorization
            let result = data.split(' ')[1]
            result = jwt.decode(result)
            const email = result.email
            const firstName = result.given_name
            const lastName = result.family_name
            const googleId = result.sub

            let user = await User.findOne({ email: email })

            if (!user) {
                user = await User.create({ ...req.body, email, firstName, lastName, googleId })
            }
            const token = jwt.sign({ email: user.email, id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "10h" })
            return res.status(201).json({ user, token })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    userLogin: async (req, res) => {
        try {
            const { error } = validatelogin(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).send({ message: "User credentials are wrong" })
            }
            const checkPass = await bcrypt.compare(req.body.password, user.password)
            if (!checkPass) {
                return res.status(400).send({ message: "User credentials are wrong" })
            }
            const token = jwt.sign({ email: user.email, id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "10h" })
            return res.status(201).json({ user, token, msg: "Work aayiyii" })
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    },

    otpLogin: async (req, res) => {
        try {
            console.log(req.body);
            let mobile = req.body.mob
            mobile = mobile.slice(3)
            console.log(mobile);
            const user = await User.findOne({ mobile: mobile })
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }
            const token = jwt.sign({ email: user.email, id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "10h" })
            return res.status(201).json({ user, token, msg: "Work aayiyii" })
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    },

    profile: async (req, res) => {
        const updatedFields = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
            bloodGroup: req.body.bloodGroup,
            weight: req.body.weight,
            age: req.body.age,
            gender: req.body.gender,
            district: req.body.district,
        }
        try {
            const existingMob = await User.findOne({ mobile: updatedFields.mobile })
            const mob = existingMob?._id?.toString() || null;
            const existingMail = await User.findOne({ email: updatedFields.email })
            const mail = existingMail?._id?.toString() || null;
            if (existingMob && mob !== req.body._id) {
                return res.status(400).json({ mobile: "Mobile number already in use" })
            }
            if (existingMail && mail !== req.body._id) {
                return res.status(400).json({ email: "Email already in use" })
            }
            const updatedUser = await User.findOneAndUpdate({ _id: req.body._id }, updatedFields, { new: true });
            return res.status(201).json({ updatedUser, message: "updated" })
        } catch (error) {
            console.error(error);
            throw new Error('Error updating user profile');
        }
    },

    profilePicture: async (req, res) => {
        try {
            const updatedImage = await User.findOneAndUpdate({ _id: req.body.userId }, { image: req.body.url }, { new: true })
            return res.status(201).json({ updatedImage })
        } catch (error) {
            console.log(error);
        }
    },

    allDistricts: async (req, res) => {
        try {
            const districts = await Branches.distinct('district');
            return res.status(201).json({ districts })
        } catch (error) {
            return res.status(500).send({ message: "Not getting all districts" })
        }
    },

    districtChoose: async (req, res) => {
        try {
            const branches = await Branches.find({ district: req.query.district }, { branch: 1, address: 1 });
            return res.status(200).json({ branches });
        } catch (error) {
            return res.status(500).send({ message: "Error getting branches" });
        }
    },

    totalUnits: async (req, res) => {
        try {
            const response = await Donations.find()
            const details = response.length
            return res.status(200).json(details);
        } catch (error) {
            return res.status(500).send({ message: "Error getting branches" });
        }
    },

    sameBloodGroup: async (req, res) => {
        try {
            const response = await Requests.find({ bloodGroup: req.query.bloodGroup, status: "Pending" })
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).send({ message: "Error getting branches" });
        }
    },

    otherBloodGroup: async (req, res) => {
        try {
            const blood = req.query.bloodGroup
            const response = await Requests.find({ bloodGroup: { $ne: blood }, status: "Pending" });
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).send({ message: "Error getting branches" });
        }
    },

    paymentDetails: async (req, res) => {
        console.log(req.query.id);
        try {
            const response = await Payment.find({ userId: req.query.id }).exec()
            res.status(201).json(response)
        } catch (error) {
            return res.status(500).send({ message: "Payment details error" })
        }
    }
}