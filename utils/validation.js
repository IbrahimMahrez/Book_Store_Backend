

const joi=require('joi');//import joi for validation
const validator=require('validator');//import validator for additional validation

function validateBook(book){
    const schema=joi.object({
        title:joi.string().min(3).required(),
        author:joi.string().min(3).required()
    });
    return schema.validate(book);
}
  
function validateupdatebook(book){
    const schema=joi.object({
        title:joi.string().min(3),
        author:joi.string().min(3)
    })
    return schema.validate(book);
}
 

function validateAuthor(author){
    const schema=joi.object({
        firstName:joi.string().min(3).required(),
        lastName:joi.string().min(3).required(),
        age:joi.number().integer().min(0).required()
    });
    return schema.validate(author);
}
  
function validateupdateAuthor(author){
    const schema=joi.object({
        firstName:joi.string().min(3).required(),
        lastName:joi.string().min(3).required(),
        age:joi.number().integer().min(0).required()
    })
    return schema.validate(author);
}

module.exports={
    validateBook,
    validateupdatebook,
    validateAuthor,
    validateupdateAuthor
};

