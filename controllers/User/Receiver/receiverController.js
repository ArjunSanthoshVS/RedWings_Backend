const { Requests } = require("../../../models/Admin/requests");

module.exports = {
    request: async (req, res) => {
        try {
            const request = new Requests({
                fullName: req.body.fullName,
                gender: req.body.gender,
                age: req.body.age,
                district: req.body.selectedDistrict,
                branch: req.body.selectedBranch,
                bloodGroup: req.body.blood,
                unit: req.body.unit,
                reason: req.body.reason,
                receivedDate: req.body.receivedDate,
                status: req.body.status,
                userId: req.body.userId
            });

            request.save()
            return res.status(201).send('Updated')
        } catch (error) {
            return res.status(500).send("Donation failed: " + error.message)
        }
    },

    transfusion_history: async (req, res) => {
        try {
            const transfusionHistory = await Requests.find({ userId: req.query.id }).exec()
            res.status(201).json(transfusionHistory)
        } catch (error) {
            res.status(500).send("errrr")
        }
    },

    cancel: async (req, res) => {
        try {
            const cancel = await Requests.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true })
            res.json(cancel)
        } catch (error) {
            res.status(500).send("errrr")
        }
    },


    totalReceivers: async (req, res) => {
        try {
            const response = await Requests.distinct('userId', { status: "Approved" })
            const details = response.length
            return res.status(200).json(details);
        } catch (error) {
            res.status(500).send("errrr")
        }
    },

    totalRequests: async (req, res) => {
        try {
            const response = await Requests.find()
            const details = response.length
            return res.status(200).json(details);
        } catch (error) {
            res.status(500).send("errrr")
        }
    },

    pendingRequests: async (req, res) => {
        try {
            const response = await Requests.find({ status: "Pending" })
            const details = response.length
            return res.status(200).json(details);
        } catch (error) {
            res.status(500).send("errrr")
        }
    },

    approvedRequests: async (req, res) => {
        try {
            const response = await Requests.find({ status: "Approved" })
            const details = response.length
            return res.status(200).json(details);
        } catch (error) {
            res.status(500).send("errrr")
        }
    },

    rejectedRequests: async (req, res) => {
        try {
            const response = await Requests.find({ status: "Rejected" })
            const details = response.length
            return res.status(200).json(details);
        } catch (error) {
            res.status(500).send("errrr")
        }
    }
}