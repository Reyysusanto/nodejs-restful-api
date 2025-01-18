import supertest from "supertest"
import { web } from "../src/application/web.js"
import { createManyContact, createUser, getContact, removeAllAddress, removeAllContacts, removeUser } from "./test-util.js"

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