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
    const curDataCnt = -1
    client.updateData({KV_value: JSON.stringify(newData)},(err, res) => {
        if(err) console.error(err)
        else curDataCnt = res
    })

    return curDataCnt
}

const getData = (targetKey, targetNode) => {
    const client = getTargetChannel(targetNode)
    let targetData = {}
    client.getData({ K_value: targetKey },(err, res) => {
        if(err) console.error(err)
        else targetData = JSON.parse(res)
    })

    return targetData
}

const deleteData = (deleteKey, targetNode) => {
    const client = getTargetChannel(targetNode)
    let deleteCnt = -1
    client.deleteData({K_value:deleteKey}, (err,res) => {
        if(err) console.error(err)
        else deleteCnt = res
    })

    return deleteCnt
}

export {
    updateData as updateDataRemote,
    getData as getDataRemote,
    deleteData as deleteDataRemote
}