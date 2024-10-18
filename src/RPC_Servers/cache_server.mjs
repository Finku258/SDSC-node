import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'
import { fileURLToPath } from 'url'
import { storeNewData, retrieveData, deleteTargetData } from '../Cache_Data/node_data.mjs'

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
const updateDataRPC = (call, callback) => {
    const newData = JSON.parse(call.request.KV_value)
    const curDataCnt = storeNewData(newData)

    callback(null, { updateNum: curDataCnt })
}

const getDataRPC = (call, callback) => {
    const targetKey = call.request.K_value
    const targetData = retrieveData(targetKey)

    callback(null, { KV_value: JSON.stringify(targetData) })
}

const deleteDataRPC = (call,callback) => {
    const deleteKey = call.request.K_value
    const deleteCnt = deleteTargetData(deleteKey)

    callback(null, { deleteNum: deleteCnt })
}

/**
 * run rpc server
 */
const startRpcServer = (port) => {
    const server = new grpc.Server()
    server.addService(node_proto.SDSC_Node.service, {
        updateData: updateDataRPC,
        getData: getDataRPC,
        deleteData: deleteDataRPC
    })
    server.bindAsync('0.0.0.0:10260', grpc.ServerCredentials.createInsecure(), (err,port) => {
        if(err != null) {
            return console.error(err)
        }
        console.log(`gRPC server listening on ${port}`)
    })
}

export default startRpcServer