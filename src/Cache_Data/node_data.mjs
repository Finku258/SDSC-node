import { updateDataRemote, getDataRemote, deleteDataRemote } from "../RPC_Servers/cache_client.mjs"
import calcCacheNode from "../utils/hashCacheMapper.mjs"

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
const updateData = (newData) => {
    const key = Object.keys(newData)[0]
    const targetNodeId = calcCacheNode(key)
    if(targetNodeId + 1 === NODE_ID){
        cache_data.dataObj = {...cache_data.dataObj,...newData}
        cache_data.dataCnt = Object.keys(cache_data.dataObj).length
    }else{
        cache_data.dataCnt = updateDataRemote(newData, NODE_LIST[targetNodeId])
    }
    return cache_data.dataCnt
}

/**
 * 查询数据
 */
const searchData = (key) => {
    const targetNodeId = calcCacheNode(key)
    if(targetNodeId === NODE_ID){
        return cache_data.dataObj.hasOwnProperty(key) 
            ? { [key]: cache_data.dataObj[key] } 
            : null
    }else{
        return getDataRemote(key, NODE_LIST[targetNodeId])
    }
}

/**
 * 删除数据
 */
const deleteData = async (key) => {
    const targetNodeId = calcCacheNode(key)

    if(targetNodeId === NODE_ID){
        if(cache_data.dataObj.hasOwnProperty(key)){
            const curDataCnt = cache_data.dataCnt
            delete cache_data.dataObj[key]
            cache_data.dataCnt = Object.keys(cache_data.dataObj).length
            return curDataCnt - cache_data.dataCnt
        }
        return 0
    }else{
        return await deleteDataRemote(key, NODE_ID[targetNodeId])
    }
}

export {
    cache_data as CacheData,
    updateData,
    searchData,
    deleteData
}