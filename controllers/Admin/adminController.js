require('dotenv').config()
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User } = require("../../models/User/user");
const { Admin } = require("../../models/Admin/admin");
const { Donations } = require("../../models/Admin/donations");
const { Requests } = require("../../models/Admin/requests");
const { Branches } = require("../../models/Admin/Branches");
const { validateAdminSignup, validatelogin } = require("../../validation/loginValidation");
const { Payment } = require('../../models/User/payment');

module.exports = {

    adminSignup: async (req, res) => {
        try {
            const { error } = validateAdminSignup(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message })
            }

            const isExisting = await Admin.findOne({ email: req.body.email })
            if (isExisting) {
                return res.status(409).send({ message: "Admin with given email already Exist!" });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newAdmin = await Admin.create({ ...req.body, password: hashedPassword })
            const token = jwt.sign({ email: newAdmin.email, id: newAdmin._id, isAdmin: newAdmin.isAdmin }, process.env.JWT_SECRET, { expiresIn: "5h" })
            return res.status(201).json({ newAdmin, token })
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    },

    adminLogin: async (req, res) => {
        try {
            const { error } = validatelogin(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }
            const admin = await Admin.findOne({ email: req.body.email })
            if (!admin) {
                return res.status(400).send({ message: "Admin credentials are wrong" })
            }
            const checkPass = await bcrypt.compare(req.body.password, admin.password)
            if (!checkPass) {
                return res.status(400).send({ message: "Admin credentials are wrong" })
            }
            const token = jwt.sign({ email: admin.email, id: admin._id, isAdmin: admin.isAdmin }, process.env.JWT_SECRET, { expiresIn: "5h" })
            return res.status(201).json({ admin, token, msg: "Work aayiyii" })

        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    },

    users: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    individualUUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (user == null) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.user = user;
            res.json(res.user);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    donations: async (req, res) => {
        try {
            const donors = await Donations.find({})
            res.json(donors);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    userDonations: async (req, res) => {
        try {
            const donors = await Donations.find({ userId: req.params.id })
            res.json(donors);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    requests: async (req, res) => {
        try {
            const requestDetails = await Requests.find()
            res.json(requestDetails)
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    userRequests: async (req, res) => {
        try {
            const requests = await Requests.find({ userId: req.params.id })
            res.json(requests);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    approveRequest: async (req, res) => {
        const userId = req.params.id;
        try {
            const approve = await Requests.findByIdAndUpdate(userId, { status: 'Approved' }, { new: true });
            res.json(approve);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    },

    rejectRequest: async (req, res) => {
        const userId = req.params.id;
        try {
            const approve = await Requests.findByIdAndUpdate(userId, { status: 'Rejected' }, { new: true });
            res.json(approve);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    },

    approveDonation: async (req, res) => {
        const userId = req.params.id;
        try {
            const approve = await Donations.findByIdAndUpdate(userId, { status: 'Approved' }, { new: true });
            res.json(approve);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    },

    rejectDonation: async (req, res) => {
        const userId = req.params.id;
        try {
            const reject = await Donations.findByIdAndUpdate(userId, { status: 'Rejected' }, { new: true });
            res.json(reject);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    },

    newBranch: async (req, res) => {
        try {
            const existingBranch = await Branches.findOne({ $and: [{ district: req.body.district }, { branch: req.body.branch }, { address: req.body.address }, { phone: req.body.phone }] });
            if (existingBranch) {
                return res.status(409).send({ message: "Branch already exists!" });
            } else {
                const branch = new Branches(req.body);
                await branch.save();
                return res.status(201).json(branch);
            }
        } catch (err) {
            res.status(500).send('Internal server error');
        }
    },

    branches: async (req, res) => {
        try {
            const branches = await Branches.find()
            res.json(branches)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    editBranch: async (req, res) => {
        const { selectedBranch, district, branch, address, phone } = req.body;
        try {
            const response = await Branches.findByIdAndUpdate({ _id: selectedBranch._id }, { ...selectedBranch, district, branch, address, phone })
            res.json(response)
        } catch (error) {
            return res.status(409).send({ message: "Branch already Exist!" });
        }
    },

    removeBranch: async (req, res) => {
        try {
            const response = await Branches.findByIdAndDelete({ _id: req.params.id })
            res.json(response)
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    districtChoose: async (req, res) => {
        try {
            const response = await Branches.find({ district: req.body })
            res.json(response)
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    units: async (req, res) => {
        try {
            const response = await Donations.find({ status: "Approved" }, { bloodGroup: 1, _id: 0 })
            const counts = response.reduce((acc, { bloodGroup }) => {
                acc[bloodGroup] = (acc[bloodGroup] || 0) + 1;
                return acc;
            }, {});
            res.send(counts)
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    fullPaymentDetails: async (req, res) => {
        try {
            const response = await Payment.find()
            res.json(response)
        } catch (error) {
            res.status(500).send({ message: "Payment details error" })
        }
    },
}

// module.exports = adminController