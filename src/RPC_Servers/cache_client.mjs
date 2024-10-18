import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/logger.mjs'

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

const updateDataClient = async (newData,targetNode) => {
    const client = getTargetChannel(targetNode)
    const curDataCnt = await new Promise((resolve, reject) => {
        client.updateData({KV_value: JSON.stringify(newData)},(err, res) => {
            if(err){
                console.error(err)
                reject(err)
            }else{
                resolve(res.updateNum)
            }
        })
    })

    return curDataCnt
}

const getDataClient = async (targetKey, targetNode) => {
    const client = getTargetChannel(targetNode)
    const targetData = await new Promise((resolve, reject) => {
        client.getData({ K_value: targetKey },(err, res) => {
            if(err){
                logger.error(err)
                reject(err)
            }else{
                resolve(res.KV_value)
            }
        })
    })

    return JSON.parse(targetData)
}

const deleteDataClient = async (deleteKey, targetNode) => {
    const client = getTargetChannel(targetNode)
    const deleteCnt = await new Promise((resolve, reject) => {
        client.deleteData({K_value:deleteKey}, (err,res) => {
            if(err){
                console.error(err)
                reject(err)
            }else{
                resolve(res.deleteNum)
            }
        })
    })

    return deleteCnt
}

export {
    updateDataClient,
    getDataClient,
    deleteDataClient
}