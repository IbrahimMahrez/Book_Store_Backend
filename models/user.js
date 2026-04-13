const mongoose=require('mongoose');
const joi=require('joi');


const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3
    },
    email:{ 
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: function(v) {
                return joi.string().email().validate(v).error === undefined;
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

//generate JWT token for user authentication
userschema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};


const User=mongoose.model('User',userschema);

function validateUserregister(user){
    const schema = joi.object({
        username: joi.string().min(3).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
      

    });

    return schema.validate(user);
}

function validateuserlogin(user){
    const schema=joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(6).required()
    });
    return schema.validate(user);

}

function validateupdateuser(user){
    const schema=joi.object({
        username:joi.string().min(3),
        email:joi.string().email(),
        password:joi.string().min(6)
    });
    return schema.validate(user);
}








module.exports={User, validateUserregister, validateuserlogin, validateupdateuser};