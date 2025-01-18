import Joi from "joi"

const createAddressValidation = Joi.object({
    street: Joi.string().max(100).optional(),
    city: Joi.string().max(50).optional(),
    province: Joi.string().max(50).optional(),
    country: Joi.string().max(50).required(),
    postal_code: Joi.string().max(10).required(),
})

export { createAddressValidation }