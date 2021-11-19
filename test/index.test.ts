import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app'

const api = request(app)

const initialUsers = [
    {
        username: 'MrKrrot',
        password: '$2b$10$uB5EOL70hpAKZ3JGtPy1OuA6xU7bBy1VDRH6hXSFfcj1asETSKJty',
        name: 'Rafael Olguín',
    },
    {
        username: 'Oddy',
        password: '$2b$10$uB5EOL70hpAKZ3JGtPy1OuA6xU7bBy1VDRH6hXSFfcj1asETSKJty',
        name: 'Karen Oddete',
    },
]

describe('register', () => {
    test('with valid credentials', async () => {
        await api
            .post('/register')
            .send({ username: 'MrKrrot', name: 'Rafael Olguin', password: 'pass123' })
            .expect(201)
    })
})

describe('login', () => {
    test('with empty credentials', async () => {
        await api
            .post('/login')
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
    test('with valid credentials', async () => {
        const response = await api.post('/login').send({ username: 'MrKrrot', password: 'pass123' })
        expect(response.body.username).toBeDefined()
        expect(response.body.name).toBeDefined()
        expect(response.body.token).toBeDefined()
        expect(200)
    })
})

afterEach(() => {
    //mongoose.connection.close()
})

afterAll(() => {
    mongoose.connection.close()
    app.listen().close()
})
