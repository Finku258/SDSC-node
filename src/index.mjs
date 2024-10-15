import startHttpServer from './HTTP_Server/http_server.mjs'
import startRpcServer from './RPC_Servers/cache_server.mjs'

startHttpServer(5000)
startRpcServer(10260)
