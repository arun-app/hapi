const Hapi = require('@hapi/hapi');
const Bell = require('@hapi/bell');

const plugin=()=>{
    server.register(Bell);
    server.register(require('@hapi/vision'));
    server.register(require('@hapi/inert'));
}

module.exports={plugin}