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
        method: 'GET',
        path: '/api/profile',
        handler: async (request, h) => {
            try {
                const userProfile = await githubApi.users.getAuthenticated({username});
                const { data } = userProfile; 
                const userData = {
                    username: data.login, 
                    avatar_url: data.avatar_url, 
                    profile_url: data.html_url, 
                    type: data.type 
                };
                return h.response(userData);
            } catch(e) {
                console.log(e);
                return h.code(500);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/profile/repos',
        handler: async (request, h) => {
            try {
                const starredRepos = await githubApi.activity.listReposStarredByAuthenticatedUser({sort: "created"});
                const { data = [] } = starredRepos;
                console.log("request repos", data);
                const repos = data.map(item => {
                    return {
                        full_name: item.full_name,
                        description: item.description,
                        html_url: item.html_url,
                        stargazers_count: item.stargazers_count
                    };
                });
                return h.response({repos});
            } catch(e) {
                console.log(e);
                return h.code(500);
            }
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
                const { data } = userProfile; 
                const userData = {
                    username: data.login, 
                    avatar_url: data.avatar_url, 
                    profile_url: data.html_url, 
                    type: data.type 
                };
                return h.response(userData);
            } catch(e){
                console.log(e);
                return h.code(500);
            };
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