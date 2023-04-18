const Joi = require("joi");
const passwordComplexity=require("joi-password-complexity")
//Login
const validatelogin = (data) => {
    console.log(data,'ooooo');
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    console.log(schema,'jnjnj');
    return schema.validate(data);
};

const validateSignup = (data) => {
    console.log(data,'ooooo');
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}

const validateAdminSignup = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().required().label("Full Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}

module.exports = { validatelogin, validateSignup, validateAdminSignup }