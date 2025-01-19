import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt"

const removeUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'Reyy12'
        }
    })
}

const createUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "Reyy12",
            password: await bcrypt.hash("reyy123", 10),
            name: "Reyy",
            token: "test"
        }
    })
}

const getUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "Reyy12"
        }
    })
}

const removeAllContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: "Reyy12"
        }
    })
}

const createContact = async () => {
    await prismaClient.contact.create({
        data: {
            username: "Reyy12",
            first_name: "Reyy",
            last_name: "Max",
            email: "reyy@gmail.com",
            phone: "081293842723"
        }
    })
}

const createManyContact = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: "Reyy12",
                first_name: `test ${i}`,
                last_name: `node`,
                email: `test${i}@gmail.com`,
                phone: `08129384272${i}`
            }
        })
    }
}

const getContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "Reyy12"
        }
    })
}

const removeAllAddress = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                user: {
                    username: "Reyy12"
                }
            }
        }
    })    
}

const createAddress = async () => {
    const contact = await getContact()
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: "jalan",
            city: 'kota',
            province: 'provinsi',
            country: 'indonesia',
            postal_code: '382829'
        }
    })
}

const getAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: "Reyy12"
            }
        }
    })
}

export { removeUser, createUser, getUser, removeAllContacts, createContact, getContact, createManyContact, removeAllAddress, createAddress, getAddress }