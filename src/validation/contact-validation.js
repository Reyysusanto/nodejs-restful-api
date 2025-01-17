import Joi from "joi"

const contactRegister = Joi.object({
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).optional(),
    email: Joi.string().max(50).optional(),
    phone: Joi.string().max(16).required(),
})

const getContactValidation = Joi.number().positive().required()

const updateContactValidation = Joi.object({
    id: Joi.number().positive().required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).optional(),
    email: Joi.string().max(50).optional(),
    phone: Joi.string().max(16).optional(),
})

export { contactRegister, getContactValidation, updateContactValidation }