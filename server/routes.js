var Boom = require("boom");
const uuidv1 = require("uuid/v1");
const axios = require("axios");

var routes = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.file("./public/index.html");
    }
  },
  {
    method: "GET",
    path: "/api/profile",
    handler: (request, h) => {
      return h.response(request.auth.credentials);
    }
  },
  {
    method: "GET",
    path: "/api/profile/repos",
    handler: async (request, h) => {
      try {
        const { username } = request.auth.credentials;

        //select and check model/table if the username has repos stored in db
        const Repos = require("./models/repos");
        const collection = await Repos.findAll(
          { username },
          {
            columns: [
              "full_name",
              "description",
              "html_url",
              "stargazers_count"
            ]
          }
        );

        if (collection && collection.models.length > 0) {
          return h.response({ repos: collection });
        } else {
          const result = await axios.get(
            `https://api.github.com/users/${username}/starred?sort=created`
          );
          if (result && result.status == 200) {
            console.log("githubResult");
            const { data = [] } = result;
            for (const item of data) {
              const itemData = {
                full_name: item.full_name,
                description: item.description,
                html_url: item.html_url,
                stargazers_count: item.stargazers_count
              };
              await Repos.forge({ ...itemData, username }).save();
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
  },
  {
    method: "POST",
    path: "/api/login",
    options: {
      handler: async (request, h) => {
        if (request.auth.isAuthenticated) {
          return h.response(request.auth.credentials);
        }
        
        let account = null;

        const { username, password } = request.payload;
        if (username && password) {
          const auth =
            "Basic " +
            Buffer.from(username + ":" + password).toString("base64");
          //console.log("basic auth", auth, username, password);
          try {
            const result = await axios.get("https://api.github.com/user", {
              headers: {
                Authorization: auth
              }
            });
            if (result && result.status == 200) {
              const { data } = result;
              account = {
                username: data.login,
                avatar_url: data.avatar_url,
                profile_url: data.html_url,
                type: data.type
              };
            }
          } catch (e) {
            console.log("on login validate error", e);
            return h.response({}).code(412);
          }
        }

        const sid = uuidv1();
        await request.server.app.cache.set(sid, { account }, 0);
        request.cookieAuth.set({ sid });

        return h.response(account);
      },
      auth: { mode: "try" },
      plugins: { "hapi-auth-cookie": { redirectTo: false } }
    }
  },
  {
    method: "GET",
    path: "/api/logout",
    handler: function(request, h) {
      console.log("api-logout");
      request.server.app.cache.drop(request.state["user-cookie-auth"].sid);
      request.cookieAuth.clear();
      return h.response();
    }
  }
];

module.exports = routes;
