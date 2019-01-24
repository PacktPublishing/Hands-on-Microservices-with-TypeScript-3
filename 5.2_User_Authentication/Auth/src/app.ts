// https://console.developers.google.com/apis/credentials?project=strange-passage-227507
const googleConfig = {
    clientId: "<clientId>",
    clientSecret: "<clientSecret>",
    redirect: "http://localhost:3003/auth/google/callback", // this must match your google api settings
};
let mysecret = "my-secret-423895230789@!#$hgfjksd2fgvjk3721356";

import { Logger } from "./logger";
import * as express from "express";
import * as passport from "passport";
// import * as passportJwt from "passport-jwt";
import * as session from "express-session";
import * as jwt from "jsonwebtoken";
import * as ejwt from "express-jwt";
import { url } from "inspector";
import * as querystring from "querystring";
function main(): void {
    let app: express.Express = express();
    let logger = new Logger("info");

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    app.use(express.static("public"));

    app.use(session({
        secret: mysecret,
    }));

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    // app.use(ejwt({ secret: mysecret, userProperty: "idtoken" }).unless({ path: ["/auth/google", "/auth/google/callback"] }));

    const {
        Issuer,
        Strategy,
    } = require("openid-client");
    const googleIssuer = new Issuer({
        issuer: "https://accounts.google.com",
        authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        token_endpoint: "https://www.googleapis.com/oauth2/v4/token",
        userinfo_endpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
        jwks_uri: "https://www.googleapis.com/oauth2/v3/certs",
    }); // => Issuer
    console.log("Set up issuer %s %O", googleIssuer.issuer, googleIssuer.metadata);

    const client = new googleIssuer.Client({
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        redirect_uris: [googleConfig.redirect],
    }); // => Client

    client.authorizationUrl({
        // redirect_uri: 'http://localhost:3000/google-auth',
        scope: ["https://www.googleapis.com/auth/plus.login"],
    }); // => String (URL)

    passport.use("oidc", new Strategy({
        client,
    }, (tokenset, userinfo, done) => {
        // this is what we get back:
        console.log("tokenset: ", tokenset);
        console.log("access_token: ", tokenset.access_token);
        console.log("id_token: ", tokenset.id_token);
        console.log("claims: ", tokenset.claims);
        console.log("userinfo: ", userinfo);
        console.log("userID: ", tokenset.claims.sub);

        // get the user from the database (just a mock here..)
        let user = {
            name: userinfo.name,
            id: userinfo.sub,
            pic: tokenset.claims.picture,
        };

        console.log("pic: ", tokenset.claims.picture);
        console.log(">>>> returning: ", JSON.stringify(user));

        return done(null, user);
    }));

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback

    // app.get("/auth/google", (req, res, next) => {
    //     logger.debug("aaaa");
    //     res.end("ok");
    // });

    app.get("/auth/google",
        passport.authenticate("oidc", {
            // session: false,
            scope: ["https://www.googleapis.com/auth/plus.login"],
        }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get("/auth/google/callback",
        passport.authenticate("oidc", {
            // optional: //successRedirect: '/',
            // session: false,
            failureRedirect: "/login",
        },
            // , (err, res) => {
            //     if (err) {
            //         logger.error(err);
            //         res.send(401, "unauthorized");
            //     }
            //     // res.redirect("localhost:3004/#/home?id_token=");
            //     // res.send("ok").end();
            // }
        ),
        // on success function:
        (req, res) => {

            let userinfo = req.user;
            let token = jwt.sign({ id: userinfo.sub, name: userinfo.name }, mysecret);
            res.cookie("idtoken", token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
            let query = querystring.stringify({ query: userinfo.name, picture: userinfo.pic });

            // return res.redirect("/#/home?id_token=" + tokens.tokens.id_token);
            res.redirect("http://localhost:3080/#/home?" + query);
            // res.send("ok").end();
        });

    // app.get("/index.html", (req, res) => {
    //     let user = req.session.passport.user;
    //     res.send("<html><body><H1> Hello, " + user.name + "<H1></body></html>");
    //     res.end();
    // });
    let port = 3003;
    app.on("error", (e) => {
        logger.error("couldn't open port " + port, e);
    });
    app.listen(port, () => {
        logger.info("Service listening on port " + port);
    }).on("error", console.log);
}

main();
