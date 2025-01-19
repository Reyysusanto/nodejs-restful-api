import supertest from "supertest"
import { web } from "../src/application/web.js"
import { createAddress, createManyContact, createUser, getAddress, getContact, removeAllAddress, removeAllContacts, removeUser } from "./test-util.js"
import { logger } from "../src/application/logging.js"

describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createUser()
        await createManyContact()
    })

    afterEach(async () => {
        await removeAllAddress()
        await removeAllContacts()
        await removeUser()
    })

    it('Berhasil delete addresses', async () => {
        const contact = await getContact()

        const result = await supertest(web)
            .post('/api/contacts/' + contact.id + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: "jalan",
                city: 'kota',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '382829'
            })

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.street).toBe('jalan');
        expect(result.body.data.city).toBe('kota');
        expect(result.body.data.province).toBe('provinsi');
        expect(result.body.data.country).toBe('indonesia');
        expect(result.body.data.postal_code).toBe('382829');
    })
})

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createUser()
        await createManyContact()
        await createAddress()
    })

    afterEach(async () => {
        await removeAllAddress()
        await removeAllContacts()
        await removeUser()
    })

    it('mendapatkan informasi conatct address', async () => {
        const contact = await getContact()
        const address = await getAddress()

        const result = await supertest(web)
            .get('/api/contacts/' + contact.id + '/addresses/' + address.id)
            .set('Authorization', 'test')

            expect(result.status).toBe(200)
            expect(result.body.data.id).toBeDefined()
            expect(result.body.data.street).toBe('jalan');
            expect(result.body.data.city).toBe('kota');
            expect(result.body.data.province).toBe('provinsi');
            expect(result.body.data.country).toBe('indonesia');
            expect(result.body.data.postal_code).toBe('382829');
    })
    
    it('gagal mendapatkan informasi conatct address', async () => {
        const contact = await getContact()
        const address = await getAddress()

        const result = await supertest(web)
            .get('/api/contacts/' + (contact.id + 1) + '/addresses/' + address.id)
            .set('Authorization', 'test')

            expect(result.status).toBe(404)
    })
})

describe('PUT /api/contacts/:contactId/address/:addressId', () => {
    beforeEach(async () => {
        await createUser()
        await createManyContact()
        await createAddress()
    })

    afterEach(async () => {
        await removeAllAddress()
        await removeAllContacts()
        await removeUser()
    })

    it('Update contact address', async () => {
        const contact = await getContact()
        const address = await getAddress()

        const result = await supertest(web)
            .put('/api/contacts/' + contact.id + '/addresses/' + address.id)
            .set('Authorization', 'test')
            .send({
                street: "street",
                city: 'kota',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '1111'
            })

            expect(result.status).toBe(200);
            expect(result.body.data.id).toBe(address.id);
            expect(result.body.data.street).toBe("street");
            expect(result.body.data.city).toBe("kota");
            expect(result.body.data.province).toBe("provinsi");
            expect(result.body.data.country).toBe("indonesia");
            expect(result.body.data.postal_code).toBe("1111");
    })
})

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createUser()
        await createManyContact()
        await createAddress()
    })

    afterEach(async () => {
        await removeAllAddress()
        await removeAllContacts()
        await removeUser()
    })

    it('berhasil delete contact', async () => {
        const contact = await getContact()
        let address = await getAddress()

        const result = await supertest(web)
            .delete('/api/contacts/' + contact.id + '/addresses/' + address.id)
            .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        address = await getAddress()
        expect(address).toBeNull()
    })

    it('gagal delete contact, address tidak ditemukan', async () => {
        const contact = await getContact()
        let address = await getAddress()

        const result = await supertest(web)
            .delete('/api/contacts/' + contact.id + '/addresses/' + (address.id + 1))
            .set('Authorization', 'test')

        expect(result.status).toBe(404)
    })

    it('gagal delete contact, kontak tidak ditemukan', async () => {
        const contact = await getContact()
        let address = await getAddress()

        const result = await supertest(web)
            .delete('/api/contacts/' + contact.id + '/addresses/' + (address.id + 1))
            .set('Authorization', 'test')

        expect(result.status).toBe(404)
    })
})

describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createUser()
        await createManyContact()
        await createAddress()
    })

    afterEach(async () => {
        await removeAllAddress()
        await removeAllContacts()
        await removeUser()
    })

    it('menampilkan list address', async () => {
        const contact = await getContact()

        const result = await supertest(web)
            .get('/api/contacts/' + contact.id + '/addresses')
            .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(1)
    })

    it('gagal menampilkan list address', async () => {
        const contact = await getContact()

        const result = await supertest(web)
            .get('/api/contacts/' + (contact.id + 1000) + '/addresses')
            .set('Authorization', 'test')

        expect(result.status).toBe(404)
    })
})