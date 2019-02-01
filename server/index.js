"use strict";
const Hapi = require("hapi");

const server = Hapi.server({
  port: 3000,
  host: "localhost"
});

const init = async () => {
  await server.register(require("inert"));
  await server.register(require("hapi-auth-cookie"));

  const cache = server.cache({
    segment: "sessions",
    expiresIn: 24 * 60 * 60 * 1000
  });
  server.app.cache = cache;

  server.auth.strategy("session", "cookie", {
    password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
    cookie: "user-cookie-auth",
    isSecure: false,
    validateFunc: async (request, session) => {
      const cached = await cache.get(session.sid);
      const out = {
        valid: !!cached
      };

      if (out.valid) {
        out.credentials = cached.account;
      }

      return out;
    }
  });

  server.auth.default("session");

  server.route(require("./routes"));

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log("unhandledRejection", err);
  process.exit(1);
});

init();
