'use strict';
const path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {

    await server.register(require('inert'));
    
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return h.file('./index.html');
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: (request, h) => {
            console.log('on login test', request.payload);
            return "works";
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();