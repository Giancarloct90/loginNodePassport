const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sqlserver = require('mssql');
const bcrypt = require('bcrypt');


// Database Initalization
require('.././database');

passport.serializeUser((user, done) => {
    done(null, user.user_Codigo);
});

passport.deserializeUser((id, done) => {
    sqlserver.query(`SELECT * FROM Users WHERE user_Codigo =` + `${id}` + ``).then((user) => {
        done(null, user.recordset[0]);
    }).catch((e) => {
        console.log('Problem deserializerUser', e)
    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        let user = await sqlserver.query(`SELECT * FROM Users WHERE user_Email =` + `'${email}'` + ``);
        if (user.rowsAffected[0] == 0) {
            console.log('No existe el user');
            return done(null, false, req.flash('signinMessage', 'El usuario o el password son incorrectos'));
        }
        if (user.rowsAffected[0] == 1) {
            try {
                if (await bcrypt.compare(password, user.recordset[0].user_Password)) {
                    console.log(user.recordset[0]);
                    console.log('Usuario Existe');
                    return done(null, user.recordset[0]);
                } else {
                    console.log('Password incorrect');
                    return done(null, false, req.flash('signinMessage', 'El usuario o el password son incorrectos'));
                }
            } catch (e) {
                return done(e)
            }
        }
    } catch (e) {

    }
}));