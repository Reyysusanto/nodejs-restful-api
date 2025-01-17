import supertest from "supertest"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js"
import bcrypt from "bcrypt"

describe("POST /api/users", () => {
    afterEach(async () => {
        await removeTestUser()
    })

    it("dapat regist user baru", async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'Reyy12',
                password: 'reyy123',
                name: 'Reyy'
            })
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('Reyy12')
        expect(result.body.data.password).toBeUndefined()
        expect(result.body.data.name).toBe('Reyy')
    })

    it("regist ditolak karena request invalid", async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            })

        logger.info(result.body)
        
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined
    })

    it("regist ditolak username sudah terdaftar", async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'Reyy12',
                password: 'reyy123',
                name: 'Reyy'
            })

        logger.info(result.body)
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("Reyy12");
        expect(result.body.data.name).toBe("Reyy");
        expect(result.body.data.password).toBeUndefined()
    })
})

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it("user dapat login", async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "Reyy12",
                password: "reyy123"
            })

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBe("test")
    })

    it("login ditolak karena request invalid", async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "",
                password: ""
            })

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    it("login ditolak karena password atau username salah", async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "Reyy12",
                password: "salah"
            })

        logger.info(result.body)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe("GET /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it("dapat mendapatkan data di user", async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test')
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("Reyy12")
        expect(result.body.data.name).toBe("Reyy")
    })
})

describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it("dapat update user", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                name: "Rey",
                password: "passwordku"
            })
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("Reyy12")
        expect(result.body.data.name).toBe("Rey")

        const user = await getTestUser()
        expect(await bcrypt.compare("passwordku", user.password)).toBe(true)
    })

    it("melakukan update password", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                password: "passwordku"
            })
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("Reyy12")

        const user = await getTestUser()
        expect(await bcrypt.compare("passwordku", user.password)).toBe(true)
    })

    it("melakukan update nama", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                password: "passwordku"
            })
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("Reyy12")
    })

    it("menolak update", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "gatau")
            .send({
                password: "passwordku"
            })
        
        expect(result.status).toBe(401)
    })
})

describe("DELETE /api/users/logout", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it("berhasil logout", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "test")
        
        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        const user = await getTestUser()
        expect(user.token).toBeNull()
    })

    it("gagal logout", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "gatau")
        
        expect(result.status).toBe(401)
    })
})