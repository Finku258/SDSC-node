import crypto from 'crypto'

const hashKey = (key) => {
    return crypto.createHash('md5').update(key).digest('hex')
}

const calcCacheNode = (key) => {
    const hash = hashKey(key)
    const bucket = parseInt(hash, 16) % 3
    let targetNode = -1

    switch(bucket){
        case 0:
            targetNode = 1
        case 1:
            targetNode = 2
        case 2:
            targetNode = 3
    }

    return targetNode
}

export default calcCacheNode