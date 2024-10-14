import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'
import { fileURLToPath } from 'url'
import { updateData, searchData, deleteData } from '../Cache_Data/node_data.mjs'

/**
 * init gRPC package
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROTO_PATH = __dirname + '/proto/cache_node.proto'
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs:String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)
const node_proto = grpc.loadPackageDefinition(packageDefinition).sdsc_node

/**
 * implement rpc methods
 */
const updateDataRPC = (call) => {
    const newData = call.request
    const curDataCnt = updateData(newData)

    return curDataCnt
}

const getDataRPC = (call) => {
    const targetKey = call.request
    const targetData = searchData(targetKey)

    return targetData
}

const deleteDataRPC = (call) => {
    const deleteKey = call.request
    const deleteCnt = deleteData(deleteKey)

    return deleteCnt
}

/**
 * run rpc server
 */
const startRpcServer = (port) => {
    const server = new grpc.Server()
    server.addService(node_proto.SDSC_Node.service, {
        updateData: updateDataRPC,
        getData: getDataRPC,
        deleteDatta: deleteDataRPC
    })
    server.bindAsync('0.0.0.0:10260', grpc.ServerCredentials.createInsecure(), (err,port) => {
        if(err != null) {
            return console.error(err)
        }
        console.log(`gRPC server listening on ${port}`)
    })
}