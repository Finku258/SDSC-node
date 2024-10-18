import { updateDataClient, getDataClient, deleteDataClient } from "../RPC_Servers/cache_client.mjs"
import calcCacheNode from "../utils/hashCacheMapper.mjs"
import Logger from '../utils/logger.mjs'

/**
 * 节点信息
 */
const NODE_ID = process.env.NODE_ID
const NODE_LIST = ["node1:10260", "node2:10260", "node3:10260"]

/**
 * 缓存数据
 */
const cache_data = {
    dataObj: {},
    dataCnt: 0
}

/**
 * 更新数据
 */
const storeNewData = (newData) => {
    cache_data.dataObj = {...cache_data.dataObj,...newData}
    cache_data.dataCnt = Object.keys(cache_data.dataObj).length
    Logger.info(`storeData: ${JSON.stringify(cache_data.dataObj)}`)
    return cache_data.dataCnt
}
const updateData = async (newData) => {
    const key = Object.keys(newData)[0]
    const targetNodeId = calcCacheNode(key)
    let updateDataCnt = 0

    if(targetNodeId + 1 === NODE_ID){
        storeNewData(newData)
    }else{
        updateDataCnt = await updateDataClient(newData, NODE_LIST[targetNodeId])
    }
    return updateDataCnt
}
/**
 * 查询数据
 */
const retrieveData = (key) => {
    return cache_data.dataObj.hasOwnProperty(key) 
            ? { [key]: cache_data.dataObj[key] } 
            : null 
}
const searchData = async (key) => {
    const targetNodeId = calcCacheNode(key)
    if(targetNodeId + 1 === NODE_ID){
        return retrieveData(key)
    }else{
        return await getDataClient(key, NODE_LIST[targetNodeId])
    }
}

/**
 * 删除数据
 */
const deleteTargetData = (key) => {
    const curDataCnt = cache_data.dataCnt
    delete cache_data.dataObj[key]
    cache_data.dataCnt = Object.keys(cache_data.dataObj).length
    return curDataCnt - cache_data.dataCnt
}
const deleteData = async (key) => {
    const targetNodeId = calcCacheNode(key)

    if(targetNodeId + 1 === NODE_ID){
        if(cache_data.dataObj.hasOwnProperty(key)){
            return deleteTargetData(key)
        }
        return 0
    }else{
        return await deleteDataClient(key, NODE_LIST[targetNodeId])
    }
}

export {
    cache_data as CacheData,
    updateData,
    storeNewData,
    searchData,
    retrieveData,
    deleteTargetData,
    deleteData
}