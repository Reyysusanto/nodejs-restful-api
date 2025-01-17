import supertest from "supertest"
import { web } from "../src/application/web.js"
import { createUser, removeAllContacts, removeUser } from "./test-util.js"

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await createUser()
    })

    afterEach(async () => {
        await removeAllContacts()
        await removeUser()
    })

    it('Membuat kontak baru', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: "Windah",
                last_name: "Basudara",
                email: "windah@gmail.com",
                phone: "08954393925"
            })
        
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.first_name).toBe("Windah")
        expect(result.body.data.phone).toBe("08954393925")
    })
})