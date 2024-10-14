import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * init gRPC package
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROTO_PATH = __dirname + '/proto/cache_node.proto'
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)
const node_proto = grpc.loadPackageDefinition(packageDefinition).sdsc_node

/**
 * gRPC client callback
 */
const getTargetChannel = (targetNode) => {
    return new node_proto.SDSC_Node(targetNode,grpc.credentials.createInsecure())
}

const updateData = (newData,targetNode) => {
    const client = getTargetChannel(targetNode)
    const curDataCnt = client.updateData(newData)

    return curDataCnt
}

const getData = (targetKey, targetNode) => {
    const client = getTargetChannel(targetNode)
    const targetData =  client.getData(targetKey)

    return targetData
}

const deleteData = (deleteKey, targetNode) => {
    const client = getTargetChannel(targetNode)
    const deleteCnt = client.deleteData(targetKey)

    return deleteCnt
}

export {
    updateData as updateDataRemote,
    getData as getDataRemote,
    deleteData as deleteDataRemote
}