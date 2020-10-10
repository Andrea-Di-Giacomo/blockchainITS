const MultiChainNode=require("./multichain-node-development");
const Bluebird = require('bluebird');
const multi=require("./mapping").datiMultichain;
function multiChainNode(nodePort,nodeHost,nodeUser,nodePsw) {
    return MultiChainNode({
        port: nodePort,
        host: nodeHost,
        user: nodeUser,
        pass: nodePsw,
        timeout: 3000
    })
}
let multichainNode =
    multiChainNode(multi.port,multi.host,multi.nome,multi.password,multi.timeout);

multichainNodeAsync = Bluebird.promisifyAll(multichainNode);
module.exports={multichainNodeAsync};
