const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// SIGNUP
exports.signup = async (req,res) => {

  try{

    const {name,email,password} = req.body

    const existingUser = await User.findOne({email})

    if(existingUser){
      return res.status(400).json({message:"User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = new User({
      name,
      email,
      password:hashedPassword
    })

    await user.save()

    res.status(201).json({
      message:"User registered successfully"
    })

  }catch(error){
    res.status(500).json({error:"Server error"})
  }

}

// LOGIN
exports.login = async (req,res) => {

  try{

    const {email,password} = req.body

    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({message:"User not found"})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"})
    }

    const token = jwt.sign(
      {id:user._id},
      "secretkey",
      {expiresIn:"1d"}
    )

    res.json({
      token,
      message:"Login successful"
    })

  }catch(error){
    res.status(500).json({error:"Server error"})
  }

}