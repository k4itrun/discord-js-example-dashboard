/**
 * This code is still incomplete, I haven't finished it yet due to lack -
 * of time, I have no idea when I will see it again, but I know I will -
 * make improvements and solve what is missing (you can contribute by making a pull request).
 */

/* The code is importing various modules and libraries that are required for the functionality of the
application. */
const DASHBOARD = require(`${process.cwd()}/src/JSON/settings.json`);
const CONFIG = require(`${process.cwd()}/src/JSON/settings.json`);
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
const passport = require("passport");
const express = require("express");
const url = require("url");
const path = require("path");
const Discord = require("discord.js");
const ejs = require("ejs");

/* The above code is setting up a web server using Express.js in a Node.js environment. It is creating
routes for handling user authentication, login, logout, and dashboard functionality. It uses
Passport.js for authentication and session management. The code also includes rendering views using
the EJS templating engine and serving static files. The server listens on a specified port and logs
a message when it is successfully loaded. */
module.exports = client => {
    
    /* The code is creating an instance of the Express.js application and initializing session
    management using the `express-session` module. It also creates a memory store for storing
    session data using the `memorystore` module. */
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);

    /* The code you provided is configuring Passport.js for user authentication. */
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((obj, done) => done(null, obj))
    passport.use(new Strategy({
        clientID: DASHBOARD.WWW.CONFIG.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET || DASHBOARD.WWW.CONFIG.CLIENT_SECRET,
        callbackURL: DASHBOARD.WWW.CONFIG.CALLBACK,
        scope: ["identify", "guilds", "guilds.join"]
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(()=>done(null, profile))
    }))

    /* The code `app.use(session({ ... }))` is configuring session management for the Express.js
    application. It sets up a session middleware using the `express-session` module. */
    app.use(session({
        store: new MemoryStore({checkPeriod: 86400000 }),
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }))

    /* The code you provided is configuring various middleware and settings for the Express.js
    application. */
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    /* The code `app.use(express.static(path.join(__dirname, "./css")));` and
    `app.use(express.static(path.join(__dirname, "./js")));` are configuring Express.js to serve
    static files from the specified directories. */
    app.use(express.static(path.join(__dirname, "./css")));

    app.use(express.static(path.join(__dirname, "./js")));

    /**
     * The function checks if a user is authenticated and redirects them to the login page if they are
     * not.
     * @param req - The `req` parameter is an object that represents the HTTP request made by the
     * client. It contains information about the request, such as the URL, headers, and body.
     * @param res - The `res` parameter is the response object in Express.js. It represents the HTTP
     * response that the server sends back to the client. It is used to send data, set headers, and
     * redirect the client to a different URL.
     * @param next - The `next` parameter is a callback function that is used to pass control to the
     * next middleware function in the request-response cycle. It is typically used to chain multiple
     * middleware functions together.
     * @returns the result of calling the `next()` function if the user is authenticated. If the user
     * is not authenticated, it sets the `backURL` property of the `req.session` object to the current
     * URL and redirects the user to the "/login" route.
     */
    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }

    /* The code `app.get("/login", (req, res, next) => { ... })` is defining a route for the "/login"
    URL path. When a GET request is made to this route, the code inside the callback function is
    executed. */
    app.get("/login", (req, res, next) => {
        if(req.session.backURL){
            req.session.backURL = req.session.backURL
        } else if(req.headers.referer){
            const parsed = url.parse(req.headers.referer);
            if(parsed.hostname == app.locals.domain){
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = "/"
        }
        next();
        }, passport.authenticate("discord", { prompt: "none"})
    );

    /* The code `app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async
    (req, res) => { ... })` is defining a route for the "/callback" URL path. When a GET request is
    made to this route, the code inside the callback function is executed. */
    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        let banned = false
        if(banned) {
            req.session.destroy()
            res.json({login: false, message: "Estás baneado de la dashboard", logout: true})
            req.logout();
        } else {
            res.redirect("/dashboard")
        }
    });

    /* The code `app.get("/logout", function(req, res) {
            req.session.destroy(()=>{
                req.logout();
                res.redirect("/");
            })
        })` is defining a route for the "/logout" URL path. When a GET request is made to this
    route, the code inside the callback function is executed. */
    app.get("/logout", function(req, res) {
        req.session.destroy(()=>{
            req.logout();
            res.redirect("/");
        })
    })

    /* The above code is defining a route handler for the root URL ("/") in a Node.js application using
    the Express framework. When a GET request is made to the root URL, the server will render the
    "index" template and pass in some data to be used in the template. The data includes the request
    object (req), the authenticated user object (if available), the Discord bot object (client), the
    PermissionsBitField object from the Discord library, the botconfig object from the
    DASHBOARD.WWW.SITE module, and the callback object from the DASHBOARD.WWW.CONFIG module. */
    app.get("/", (req, res) => {
        res.render("index", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: Discord.PermissionsBitField,
            botconfig: DASHBOARD.WWW.SITE,
            callback: DASHBOARD.WWW.CONFIG.CALLBACK,
        })
    })


    /* The above code is defining a route handler for the "/dashboard" endpoint in a Node.js
    application using the Express framework. */
    app.get("/dashboard", (req, res) => {
        if(!req.isAuthenticated() || !req.user)
        return res.redirect("/?error=" + encodeURIComponent("Inicia sesión primero por favor!"))
        if(!req.user.guilds)
        return res.redirect("/?error=" + encodeURIComponent("No puedes conseguir tus gremios"))
        res.render("dashboard", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: Discord.PermissionsBitField,
            botconfig: DASHBOARD.WWW.SITE,
            callback: DASHBOARD.WWW.CONFIG.CALLBACK,
        })
    })

    /* The above code is defining a route in a JavaScript application using the Express framework. When
    a GET request is made to the "/discord" endpoint, the server will redirect the user to the
    Discord website. The URL for the redirect is determined by the value of the
    `DASHBOARD.WWW.SITE.DISCORD` variable. */
    app.get("/discord", (req, res) => {
        res.redirect(`${DASHBOARD.WWW.SITE.DISCORD}`)
    });

    /* The above code is defining a route for the "/invite" endpoint in a JavaScript application. When
    a GET request is made to this endpoint, the code will redirect the user to a Discord
    authorization URL. The URL includes the client ID of the bot, permissions, and scope. This
    allows users to invite the bot to their Discord server with the necessary permissions. */
    app.get("/invite", (req, res) => {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${DASHBOARD.WWW.CONFIG.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`)
    });

    /* The above code is defining a route in a Node.js application using the Express framework. The
    route is accessed through the "/dashboard/:guildID" URL path. */
    app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("Todavía no estoy en este gremio, ¡agrégueme antes!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Inicia sesión primero por favor! / ¡Únete al gremio de nuevo!"))
        if(!member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild))
        return res.redirect("/?error=" + encodeURIComponent("no tienes permitido hacer eso"))
        client.settings.ensure(guild.id, {
            PREFIX: CONFIG.CLIENT.PREFIX,
            MESSAGE_BOT: "Hola como estas :)",
        });
        res.render("settings", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Discord.PermissionsBitField,
            botconfig: DASHBOARD.WWW.SITE,
            callback: DASHBOARD.WWW.CONFIG.CALLBACK,
        })
    })

    /* The above code is a route handler for a POST request to "/dashboard/:guildID". It performs
    several checks and operations related to a Discord guild (server) and its settings. Here is a
    breakdown of what the code does: */
    app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("Todavía no estoy en este gremio, ¡agrégueme antes!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Inicia sesión primero por favor! / ¡Únete al gremio de nuevo!"))
        if(!member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild))
        return res.redirect("/?error=" + encodeURIComponent("no tienes permitido hacer eso"))
        client.settings.ensure(guild.id, {
            PREFIX: CONFIG.CLIENT.PREFIX,
            MESSAGE_BOT: "Hola como estas :)",
        });
        if(req.body.PREFIX) client.settings.set(`${guild.id+"."+req.body.PREFIX}`, "PREFIX");
        if(req.body.MESSAGE_BOT) client.settings.set(`${guild.id+"."+req.body.MESSAGE_BOT}`, "MESSAGE_BOT");
        res.render("settings", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Discord.PermissionsBitField,
            botconfig: DASHBOARD.WWW.SITE,
            callback: DASHBOARD.WWW.CONFIG.CALLBACK,
        })
    })

    /* The code `app.get("*", (req, res) => { ... })` is a catch-all route that handles any request
    that doesn't match any of the defined routes. */
    app.get("*", (req, res) => {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        if (fullUrl == DASHBOARD.WWW.SITE.HOST || fullUrl == DASHBOARD.WWW.SITE.HOST || fullUrl == DASHBOARD.WWW.SITE.HOST || fullUrl == DASHBOARD.WWW.SITE.HOST ) {
            res.redirect("index.ejs");
        } else {
            res.redirect("/");
        }
    });

    /* The code `const http = require("http").createServer(app); http.listen(DASHBOARD.WWW.SITE.PORT,
    () => { client.logger(`Web Loaded: ${DASHBOARD.WWW.SITE.HOST+":"+DASHBOARD.WWW.SITE.PORT}`);
    });` is creating an HTTP server using the `http` module in Node.js. */
    const http = require("http").createServer(app);
    http.listen(DASHBOARD.WWW.SITE.PORT, () => {
        client.logger(`Web Loaded: ${DASHBOARD.WWW.SITE.HOST+":"+DASHBOARD.WWW.SITE.PORT}`);
    });
}
