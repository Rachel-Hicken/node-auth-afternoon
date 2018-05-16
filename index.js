const express = require('express');
const session = require('express-session');
require('dotenv').config();
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL
} = process.env;

const app = express();

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid email profile'
},function(accessToken, refreshToken, extraParams, profile, done){
    console.log(profile)
    done(null, profile);
}))

passport.serializeUser( (user, done) => {
    done(null, { clientID: user.id, email: user._json.email, name: user._json.name });
  });

passport.deserializeUser(function(profile, done){
    done(null, profile);
})


app.listen( SERVER_PORT, () => { console.log(`Server listening on port ${SERVER_PORT}`); } );