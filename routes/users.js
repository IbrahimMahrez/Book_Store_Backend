const express = require('express');
const router = express.Router();
const asyncWrapper = require('../middlewares/asyncwrapper');
const {User,validateupdateuser} = require('../models/user');
const bcrypt = require('bcrypt'); // import bcrypt for password hashing
const {verifytoken,verifyTokenAndAdmin,verifyTokenAndAuthorization} = require('../middlewares/verifytoken'); // import middleware to verify JWT token

//update user

router.put('/:id', verifyTokenAndAuthorization, asyncWrapper(async (req, res) => {
  const { error } = validateupdateuser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
      console.log(req.headers);
      if(req.body.password){
        const salt = await bcrypt.genSalt(10); // generate salt for hashing
        req.body.password = await bcrypt.hash(req.body.password, salt); // hash the password with the generated salt
      }
     const updateuser=await User.findByIdAndUpdate(req.params.id,{
        username:req.body.username,
        email:req.body.email,
        password:req.body.password    },{new:true}).select('-password'); // exclude password from the response
      res.status(200).json(updateuser,{ message: 'User updated successfully.' });
     if(!updateuser){
        return res.status(404).json({ message: 'User not found.' });
     }
}));



//get user by id
router.get('/', verifyTokenAndAdmin, asyncWrapper(async (req, res) => {
  
    const users = await User.find().select('-password'); // exclude password from the response
    res.status(200).json(users);
}));


//get uesr by id only admin can access

router.get('/:id', verifyTokenAndAuthorization, asyncWrapper(async (req, res) => {
  
    const users = await User.findById(req.params.id).select('-password'); // exclude password from the response
    if (!users) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(users);
}));



router.delete('/:id', verifyTokenAndAuthorization, asyncWrapper(async (req, res) => {
  
    const users = await User.findById(req.params.id).select('-password'); // exclude password from the response
    if (users) {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'User deleted successfully.' });
    }else{
        return res.status(404).json({ message: 'User not found.' });
    }
}));











module.exports = router;