import { prismaClient } from "../application/database.js";
import { contactRegister } from "../validation/contact-validation.js";
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

export default { createContact }