import express from 'express';
import { CacheData, updateData, searchData, deleteData } from '../Cache_Data/node_data.mjs'

const app = express()

app.use(express.json());

/**
 * SearchData Interface
 * param: key
 */
app.get('/:key', (req,res) => {
    const searchKey = req.params
    if(Object.keys(searchKey).length !== 0){
        const targetData = searchData(searchKey.key)
        targetData
            ? res.status(200).json(targetData)
            : res.status(404).end()
    }else{
        res.status(400).send('Bad Request: Missing or invalid data')
    }
})

/**
 * UpdateData Interface
 * body: { k:v }
 */
app.post('/',(req,res) => {
    const newData = req.body
    if(Object.keys(newData).length !== 0){
        const updateCnt = updateData(newData)
        res.status(200).send(`Succeesfully update data count: ${updateCnt}`)
    }else{
        res.status(400).send('Bad Request: Missing or invalid data')
    }
})

/**
 * DeleteData Interface
 * param: key
 */
app.delete('/:key', (req,res) => {
    const deleteKey = req.params
    if(deleteKey.key){
        const deleteCnt = deleteData(deleteKey.key)
        res.status(200).send(`${deleteCnt}`)
    }else{
        res.status(400).send('Bad Request: Missing or invalid data')
    }
})

const startHttpServer = (port) => {
    app.listen(port, () => {
        console.log(`HttpServer listening at http://localhost:${port}`)
    })
}

export default startHttpServer