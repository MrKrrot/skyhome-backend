import supertest from 'supertest'

import { app, server } from '../src/index'

const api = supertest(app)

test('index returned json 200 status code', async () => {
    await api
        .get('/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
afterAll(() => {
    server.close()
})
