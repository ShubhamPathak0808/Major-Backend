const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Hod = require("../models/hod.model");

const router = new express.Router();

// Create new hod
router.post("/hod", async (req, res) => {
    const hod = new Hod(req.body);

    try {
        await hod.save();
        res.send({data: hod, success: true});
    } catch (error) {
        console.log(error)
        if(error.code === 11000)
            res.send({success: false, reason: "Email already exists"});
        res.status(400).send(error);
    }
})

// Login hod
router.post("/hod/login", async (req, res) => {
    try {
        const hod = await Hod.findOne({email : req.body.email});
        const isMatch = (req.body.password===hod.password?true:false);
        if(isMatch)
            res.send({success: true, data: hod})
        else
            res.send({success: false})
    } catch(error) {
        console.log(error);
        res.status(400).send({success: false, error});
    }
})

// Fetch hod by ID
router.get("/hod/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const hod = await Hod.findById(_id);
        if(!hod)
            return res.status(404).send("hod not found");

        res.send({success: true, data: hod});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

module.exports = router