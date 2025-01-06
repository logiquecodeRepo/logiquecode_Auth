const joi = require('joi');
const signupValidation = async (req, res, next) =>{
    const schema = joi.object({
        name: joi.string().max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required()
    });
    const {error} = schema.validate(req.body);
    if(error) {
        return res.status(400).json({message: "Bad request", error});
    }
    next();
}

const loginValidation = async (req, res, next) =>{
    const schema = joi.object({
        username: joi.string().required(),
        password: joi.string().min(4).max(100).required(),
        captchaToken: joi.string().required(), // Add captchaToken validation
        otp: joi.string().min(6).max(100).required(), // Add captchaToken validation
    });
    const {error} = schema.validate(req.body);
    if(error) {
        return res.status(400).json({message: "Bad request", error});
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}