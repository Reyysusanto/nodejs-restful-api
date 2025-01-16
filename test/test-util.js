import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt"

const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'Reyy12'
        }
    })
}

const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "Reyy12",
            password: await bcrypt.hash("reyy123", 10),
            name: "Reyy",
            token: "test"
        }
    })
}

const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "Reyy12"
        }
    })
}

export { removeTestUser, createTestUser, getTestUser }