"use strict";
const path = require("path");
const Hapi = require("hapi");
const Inert = require("inert");
const axios = require("axios");

const server = Hapi.server({
  port: 3000,
  host: "localhost"
});

server.state("authUser", {
  ttl: 1000 * 60 * 60 * 24, // 1 day lifetime
  encoding: "base64json" // cookie data is JSON-stringified and Base64 encoded
});

const validate = async (request, username, password) => {
  const auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
  console.log("basic auth", auth, username, password);
  try {
    const result = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: auth
        }
    });
    if(result && result.status == 200) {        
        const { data } = result;
        const userData = {
          username: data.login,
          avatar_url: data.avatar_url,
          profile_url: data.html_url,
          type: data.type
        };

        return { credentials: userData, isValid: true };
    }
  } catch (e) {
    console.log("on login validate error", e);
  }

  return { credentials: null, isValid: false };
};

const init = async () => {
  await server.register(require("inert"));

  await server.register(require("hapi-auth-basic"));

  server.auth.strategy("simple", "basic", { validate });
  server.auth.default('simple');

  /*
    server.ext('onPreHandler', function (request, reply) {
        //check if we have a user in session
        const publicPages = ['/api/login'];
        const authRequired = !publicPages.includes(request.url.pathname);
        const loggedIn = request.state.authUser;
        console.log("onPreHandler", request.url.pathname, request.state, loggedIn);
        if (authRequired && !loggedIn) {
            throw new Error('not logged in');
        }
        
        return reply.continue;
    });
    */
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.file("./public/index.html");
    }
  });

  server.route({
    method: "GET",
    path: "/api/profile/repos",
    handler: async (request, h) => {
      try {
        const {username} = request.auth.credentials;

        //select and check model/table if the username has repos stored in db
        const Repos = require('./models/repos');
        const collection =  await Repos.findAll({ username }, { columns: ["full_name", "description", "html_url","stargazers_count"] })
        
        if(collection && collection.models.length > 0) {
          return h.response({ repos: collection});
        } 
        else 
        {
          const result = await axios.get(`https://api.github.com/users/${username}/starred?sort=created`);
          if(result && result.status == 200) {
            console.log("githubResult");
              const { data = [] } = result;
              for (const item of data) {
                const itemData = {
                    full_name: item.full_name,
                    description: item.description,
                    html_url: item.html_url,
                    stargazers_count: item.stargazers_count
                }
                await Repos.forge({...itemData, username}).save();
                repos.push(itemData);
              }
              
            let repos = [];
            return h.response({ repos });
          }
        }
      } catch (e) {
        console.log(e);
        return h("internal error").code(500);
      }
    }
  });

  server.route({
    method: "GET",
    path: "/api/login",
    handler: async (request, h) => {
        return h.response(request.auth.credentials);
    }
  });

  server.route({
    method: "GET",
    path: "/api/logout",
    handler: async (request, reply) => {
        reply('You are logged out now').code(401);
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log("unhandledRejection", err);
  process.exit(1);
});

init();
