import supertest from "supertest"
import { web } from "../src/application/web.js"
import { createAddress, createManyContact, createUser, getAddress, getContact, removeAllAddress, removeAllContacts, removeUser } from "./test-util.js"

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