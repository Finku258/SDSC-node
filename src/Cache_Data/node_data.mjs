import { updateDataRemote, getDataRemote, deleteDataRemote } from "../RPC_Servers/cache_client"
import calcCacheNode from "../utils/hashCacheMapper"

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
const updateData = async (newData) => {
    const key = Object.keys(newData)[0]
    const targetNodeId = calcCacheNode(key)
    if(targetNodeId === NODE_ID){
        cache_data.dataObj = {...cache_data.dataObj,...newData}
        cache_data.dataCnt = Object.keys(cache_data.dataObj).length
    }else{
        cache_data.dataCnt = await updateDataRemote(newData, NODE_LIST[targetNodeId])
    }
    printData()
    return cache_data.dataCnt
}

/**
 * 查询数据
 */
const searchData = async (key) => {
    const key = Object.keys(newData)[0]
    const targetNodeId = calcCacheNode(key)
    if(targetNodeId === NODE_ID){
        return cache_data.dataObj.hasOwnProperty(key) 
            ? { [key]: cache_data.dataObj[key] } 
            : null
    }else{
        return await getDataRemote(key, NODE_LIST[targetNodeId])
    }
}

/**
 * 删除数据
 */
const deleteData = async (key) => {
    const key = Object.keys(newData)[0]
    const targetNodeId = calcCacheNode(key)

    if(targetNodeId === NODE_ID){
        if(cache_data.dataObj.hasOwnProperty(key)){
            const curDataCnt = cache_data.dataCnt
            delete cache_data.dataObj[key]
            cache_data.dataCnt = Object.keys(cache_data.dataObj).length
            printData()
            return curDataCnt - cache_data.dataCnt
        }
        return 0
    }else{
        return await deleteDataRemote(key, NODE_ID[targetNodeId])
    }
}

/**
 * 打印数据
 */
const printData = () => {
    console.log('------Data Start------')
    console.log(`DataList: ${JSON.stringify(cache_data.dataObj)}`)
    console.log(`DataCnt: ${cache_data.dataCnt}`)
    console.log('-------Data end-------')
}

export {
    cache_data as CacheData,
    updateData,
    searchData,
    deleteData
}