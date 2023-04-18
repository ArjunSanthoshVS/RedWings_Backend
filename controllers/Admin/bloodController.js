const { Donations } = require("../../models/Admin/donations");
const { Requests } = require("../../models/Admin/requests");
const bloodController = require("express").Router()

module.exports = {

    getAvailableUnits: async (req, res) => {
        try {
            const response = await Donations.find({ status: "Approved" });
            res.json(response);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    getTransfusion: async (req, res) => {
        try {
            const response = await Requests.find();
            res.json(response);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    },

    getDonations: async (req, res) => {
        try {
            const response = await Donations.find();
            res.json(response);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
}
