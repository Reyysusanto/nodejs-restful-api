import supertest from "supertest"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"
import { createTestUser, removeTestUser } from "./test-util.js"

describe("POST /api/users", () => {
    afterEach(async () => {
        await removeTestUser()
    })

    it("Should can register new user", async () => {
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

    it("Should reject if request invalid", async () => {
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

    it("Should reject if username already registered", async () => {
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

    it("Should can login", async () => {
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

    it("Should reject login if request is invalid", async () => {
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

    it("Should reject login if password wrong", async () => {
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

    it("should can get current user", async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test')
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("Reyy12")
        expect(result.body.data.name).toBe("Reyy")
    })
})