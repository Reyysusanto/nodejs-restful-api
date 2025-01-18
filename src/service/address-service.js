import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { createAddressValidation, getAddressValidation } from "../validation/address-validation.js"
import { getContactValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"

const checkContact = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const totalContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId
        }
    })

    if(totalContact !== 1) {
        throw new ResponseError(404, "Contact not found")
    }

    return contactId
}

const createAddress = async (user, contactId, req) => {
    contactId = await checkContact(user, contactId)

    const address = validate(createAddressValidation, req)
    address.contact_id = contactId

    return prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}

const getAddress = async (user, contactId, addressId) => {
    contactId = await checkContact(user, contactId)
    addressId = validate(getAddressValidation, addressId)

    const address = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id: addressId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })

    if(!address) {
        throw new ResponseError(404, "Address not found")
    }

    return address
}

export default { createAddress, getAddress }