import { startHttpServer } from './HTTP_Server/http_server.mjs'
import startRpcServer from './RPC_Servers/cache_server'

startHttpServer(5000)
startRpcServer(10260)
