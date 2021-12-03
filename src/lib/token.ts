import dotenv from 'dotenv'
dotenv.config()

const token = process.env.SECRET_TOKEN

if (!token) {
    console.error(
        'Secret Token is not defined.',
        'Set a value for SECRET_TOKEN environment variable'
    )
    process.exit(1)
}

export default token
