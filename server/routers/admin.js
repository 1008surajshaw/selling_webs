const { User,Course,Admin } = require("../db");
const jwt = require('jsonwebtoken')
const { SECRET } = require("../middleware/auth")
const { authentication } =require("../middleware/auth")
const express = require("express")
const mongoose = require("mongoose")

const router = express.Router();

router.get("/me",authentication,async (req,res) =>{
    const admin = await Admin.findOne({username:req.User.username});

    if(!admin){
        req.statusCode(403).json({msg:"Amdin doesnt exist"})
        return
    }
    res.json({
        username: admin.username
    })
});

router.post("/signup", (req,res) =>{
    const { username, password} = req.body;
    try{
       const user = Admin.findOne({username})
       if(user){
        res.status(403).json({ message: 'Admin already exists' });
       }
       const obj = { username: username, password: password};
       const newAdmin = new Admin(obj);
       newAdmin.save();

       const token = jwt.sign({ username , role:'admin'}, SECRET, {expiresIn:'1h'});
       res.json({message:"admin is created" ,token})

    }
    catch(error){
       console.log("comes inn catch block in signup")
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.headers;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

  router.post('/courses', authenticateJwt, async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
  });
  
router.put("/courses/:courseId",authentication,async (req,res) =>{
    const course = await Course.findByIdAndUpdate(req.params.courseId,req.body, {new:true});
    if(course) {
        res.json({ message: 'Course updated successfully' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

  
router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({});
    res.json({ courses });
  });
  
  router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  });

  module.exports = router

