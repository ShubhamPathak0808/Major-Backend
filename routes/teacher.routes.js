const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher.model");

const router = new express.Router();

// Create new teacher
// router.post("/teachers", async (req, res) => {             /* check */
//     const teacher = new Teacher(req.body);

//     try {
//         await teacher.save();
//         res.send({data: teacher, success: true});
//     } catch (error) {
//         console.log(error)
//         if(error.code === 11000)
//             res.send({success: false, reason: "Email already exists"});
//         res.status(400).send(error);
//     }
// })

// Login teacher
router.post("/teachers/login", async (req, res) => {
    try {
        const teacher = await Teacher.findOne({email : req.body.email});
        const isMatch = (req.body.password===teacher.password?true:false);
        // const token = jwt.sign({_id: teacher._id}, process.env.JWT_KEY);
        if(isMatch)
            res.send({success: true, data: teacher})
        else
            res.send({success: false})
    } catch(error) {
        console.log(error);
        res.status(400).send({success: false, error});
    }
})

// Get an array of all teachers
router.get("/teachers", async (req, res) => {

    try {
        const teachers = await Teacher.find({});
        res.send({success: true, data: teachers});
    } catch (error) {
        res.status(400).send({success: false, error});
    }
})

// Fetch teacher by ID
router.get("/teacher/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const teacher = await Teacher.findById(_id);
        if(!teacher)
            return res.status(404).send("Teacher not found");
        
        res.send({success: true, data: teacher});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

// Update teacher name
router.post("/update/teacher", async (req, res) => {
    try {
        const teacher = await Teacher.findOneAndUpdate({email: req.body.email}, {
            fName: req.body.fName,
            lName: req.body.lName
        }, {new: true, runValidators: true});
        res.send({data: teacher, success: true});
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

module.exports = router