import supertest from "supertest"
import { web } from "../src/application/web.js"
import { createContact, createManyContact, createUser, getContact, removeAllContacts, removeUser } from "./test-util.js"

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

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createUser()
        await createContact()
    })

    afterEach(async () => {
        await removeAllContacts()
        await removeUser()
    })

    it("Mengambil informasi kontak", async () => {
        const contact = await getContact()
        
        const result = await supertest(web)
            .get('/api/contacts/' + contact.id)
            .set("Authorization", "test")
        
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(contact.id)
        expect(result.body.data.first_name).toBe(contact.first_name)
        expect(result.body.data.email).toBe(contact.email)
        expect(result.body.data.phone).toBe(contact.phone)
    })

    it("kontak tidak ditemukan", async () => {
        const contact = await getContact()

        const result = await supertest(web)
            .get('/api/contacts/' + (contact.id + 1))
            .set("Authorization", "test")
        
        expect(result.status).toBe(404)
    })
})

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createUser()
        await createContact()
    })

    afterEach(async () => {
        await removeAllContacts()
        await removeUser()
    })

    it("Update kontak", async () => {
        const contact = await getContact()
        
        const result = await supertest(web)
            .put('/api/contacts/' + contact.id)
            .set("Authorization", "test")
            .send({
                first_name: "Rey",
                last_name: "Marteen",
                email: "reyymarteen@gmail.com",
                phone: "084239832454"
            })
        
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(contact.id)
        expect(result.body.data.first_name).toBe("Rey")
        expect(result.body.data.email).toBe("reyymarteen@gmail.com")
        expect(result.body.data.phone).toBe("084239832454")
    })

    it("kontak tidak ditemukan", async () => {
        const contact = await getContact()

        const result = await supertest(web)
            .put('/api/contacts/' + contact.id)
            .set("Authorization", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "rey",
                phone: ""
            })
        
        expect(result.status).toBe(400)
    })
})

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createUser()
        await createContact()
    })

    afterEach(async () => {
        await removeAllContacts()
        await removeUser()
    })

    it('Delete contact sukses', async () => {
        let contact = await getContact()
        const result = await supertest(web)
            .delete('/api/contacts/' + contact.id)
            .set('Authorization', 'test')
        
        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        contact = await getContact()
        expect(contact).toBeNull()
    })

    it('Gagal delete contact', async () => {
        let contact = await getContact()
        const result = await supertest(web)
            .delete('/api/contacts/' + (contact.id + 1))
            .set('Authorization', 'test')
        
        expect(result.status).toBe(404)
    })
})

describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await createUser()
        await createManyContact()
    })

    afterEach(async () => {
        await removeAllContacts()
        await removeUser()
    })

    it("Mencari informasi kontak", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set("Authorization", "test")
        
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(10)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it("Mencari informasi kontak di page 2", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                page: 2
            })
            .set("Authorization", "test")
        
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(5)
        expect(result.body.paging.page).toBe(2)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it("Mencari informasi kontak dengan nama", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                name: "test 1"
            })
            .set("Authorization", "test")
        
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })

    it("Mencari informasi kontak dengan email", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                email: "test1"
            })
            .set("Authorization", "test")
        
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })

    it("Mencari informasi kontak dengan no hp", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: "081293842721"
            })
            .set("Authorization", "test")
        
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })
})