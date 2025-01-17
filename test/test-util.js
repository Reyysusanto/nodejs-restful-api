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

const getContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "Reyy12"
        }
    })
}

export { removeUser, createUser, getUser, removeAllContacts, createContact, getContact }