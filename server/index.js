'use strict';
const path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Octokit = require('@octokit/rest');
let githubApi;

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

            return h.file('./public/index.html');
        }
    });

    server.route({
        method: 'POST',
        path: '/api/login',
        handler: async (request, h) => {
            console.log('on login test', request.payload);
            const {username, password} = request.payload;
            try {
                githubApi = new Octokit({
                    auth: {
                        username,
                        password
                    }
                });
                const userProfile = await githubApi.users.getAuthenticated({username});
                const starredRepos = await githubApi.activity.listReposStarredByAuthenticatedUser({sort: "created"});
                const { data = [] } = starredRepos;
                console.log('on octokit getAuthenticated', data.map(item => {
                    return {
                        full_name: item.full_name,
                        description: item.description,
                        html_url: item.html_url,
                        stargazers_count: item.stargazers_count
                    };
                }));
                
            } catch(e){
                console.log(e);
            };
            return h.response({username, password});
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