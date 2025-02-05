const router = require('express').Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = "mysecret@key";

//REGISTER
router.post("/register", async (req, res) => {
    try {
      const { password } = req.body;
      const salt = await bcrypt.genSalt(10); //create salt (the salt is adding extra string to the password to make it more secure)
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const user = new User(req.body);
      await user.save();
      jwt.sign({ id: user._id }, JWT_SECRET, (err, token) => {
        if (err) {
          console.log(err);
        }
        res.status(201).send({ message: "User registered successfully", user, token });
      })
    } catch (error) {
      // Check for validation errors
    if (error.name === 'ValidationError') {
        const firstError = Object.values(error.errors)[0].message;
        return res.status(400).json({ error: firstError });
      }
  
      // Handle unique field errors (duplicate email)
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      // Default server error
      res.status(500).json({ error: "Server Error" });
    }
  });


module.exports = router;