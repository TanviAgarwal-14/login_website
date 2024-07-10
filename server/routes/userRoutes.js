const express = require("express");
const User = require("../models/userModel");
const bcrypt= require('bcrypt');
const router = express.Router();

router.post("/register", async (req, res) => {

    try{
        const userExsits = await User.findOne({email:req.body.email});
        if(userExsits){
            req.send({
                success: false,
                message: "User Already Exists"
            });
        }

        const salt=await bcrypt.genSalt(10) //salting enhances security by ensuring that even if two users have the same password, their hashed passwords will be different
        const hashedPassword = await bcrypt.hash(req.bosy.pass, salt)//will take the password hash it and salt to make it more secure.
        req.body.password = hashedPassword

        const newUser = new User(req.body) //get the data of the user from body
        await newUser.save() //save it

        res.status(201).json('User Created')
    } 
    catch(error){ 
        //if there is some error
        res.json(error)

    }
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({email : req.body.email})
    
    if(!user){
        res.send({
            success: false,
            message: 'User Does not exist, please register'
        })
    }

    const validPassword= await bcrypt.compare(req.body.password, user.password )

    if(!validPassword){
        return res.send({
            success: false,
            message: "Invalid Password"
        })
    }

    res.send({
        success : true,
        message :"user Logged in"
    })
});


module.exports = router;