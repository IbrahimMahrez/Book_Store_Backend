const express = require('express');
const router = express.Router();
const asyncWrapper = require('../middlewares/asyncwrapper');
const {User,validateUserregister,validateuserlogin} = require('../models/user');
const bcrypt = require('bcrypt'); // import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // import jsonwebtoken for token generation


// POST user registration
router.post('/register', asyncWrapper(async (req, res) => {
   const { error } = validateUserregister(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: 'User already registered.' });
    }
    const salt = await bcrypt.genSalt(10); // generate salt for hashing
    req.body.password = await bcrypt.hash(req.body.password, salt); // hash the password with the generated salt


    user =new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
   const result= await user.save();
    const token= user.generateAuthToken(); // generate JWT token using the method defined in the user model
    res.header('Authorization', token).json({ message: 'User registered successfully.', token }); // return the token in the response header and body

  const { password, ...resultWithoutPassword } = result.toObject();

res.status(201)
   .header('Authorization', token)
   .json({
       message: 'User registered successfully.',
       token,
       result: resultWithoutPassword
   });


}));


//login

router.post('/login', asyncWrapper(async (req, res) => {
   const { error } = validateuserlogin(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

   const ispasswordmatch= await bcrypt.compare(req.body.password,user.password); // compare the provided password with the stored hashed password
   if(!ispasswordmatch){
    return res.status(400).json({ message: 'Invalid email or password.' });
   }
                          
    const token= user.generateAuthToken(); // generate JWT token using the method defined in the user model
    res.header('Authorization', token).json({ message: 'User logged in successfully.', token }); // return the token in the response header and body
   
    const { password, ...resultWithoutPassword } = user.toObject(); // exclude password from the response
  

res.status(200)
   .header('Authorization', token)
   .json({
       message: 'User logged in successfully.',
       token,
       result: resultWithoutPassword
   });

})); 




module.exports = router;