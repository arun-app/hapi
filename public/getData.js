const getDate = {
    name: 'getDate',
    version: '1.0.0',
    register: async function (server, options) {

        const currentDate = function() {

            const date =  options.name +new Date();
            return date;
        };

        server.decorate('toolkit', 'getDate', currentDate);
    }
};
module.exports=getDate;