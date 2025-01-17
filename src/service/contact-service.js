import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { contactRegister, getContactValidation, updateContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";

const createContact = async (user, req) => {
    const contact = validate(contactRegister, req)
    contact.username = user.username

    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })
}

const getContact = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const contact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id: contactId
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })

    if(!contact) {
        throw new ResponseError(404, "Contact not found")
    }

    return contact
}

export default { createContact, getContact }