import fs from 'fs'
import storage from './storage'

const getPath = async (username: string) => {
    const files = await fs.promises.opendir(`${storage}/${username}`)
    return files
}

export default getPath
