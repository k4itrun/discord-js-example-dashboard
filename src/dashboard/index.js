/**
 * This code is still incomplete, I haven't finished it yet due to lack -
 * of time, I have no idea when I will see it again, but I know I will -
 * make improvements and solve what is missing (you can contribute by making a pull request).
 */

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

module.exports = client => {
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);

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
    }
    ))

    app.use(session({
        store: new MemoryStore({checkPeriod: 86400000 }),
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }))

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

    app.use(express.static(path.join(__dirname, "./css")));

    app.use(express.static(path.join(__dirname, "./js")));

    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }

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

    app.get("/logout", function(req, res) {
        req.session.destroy(()=>{
            req.logout();
            res.redirect("/");
        })
    })

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

    app.get("/discord", (req, res) => {
        res.redirect(`${DASHBOARD.WWW.SITE.DISCORD}`)
    });

    app.get("/invite", (req, res) => {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${DASHBOARD.WWW.CONFIG.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`)
    });

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

    app.get("*", (req, res) => {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        if (fullUrl == DASHBOARD.WWW.SITE.HOST || fullUrl == DASHBOARD.WWW.SITE.HOST || fullUrl == DASHBOARD.WWW.SITE.HOST || fullUrl == DASHBOARD.WWW.SITE.HOST ) {
            res.redirect("index.ejs");
        } else {
            res.redirect("/");
        }
    });

    const http = require("http").createServer(app);
    http.listen(DASHBOARD.WWW.SITE.PORT, () => {
        client.logger(`Web Loaded: ${DASHBOARD.WWW.SITE.HOST+":"+DASHBOARD.WWW.SITE.PORT}`);
    });
}
