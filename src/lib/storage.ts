import dotenv from 'dotenv'
dotenv.config()

const storage = process.env.STORAGE_PATH

if (!storage) {
    console.error(
        'Storage path is not defined',
        'set a value for STORAGE_PATH environment variable'
    )
    process.exit(1)
}

export default storage
