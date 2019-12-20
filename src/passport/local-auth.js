const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sqlserver = require('mssql');
const bcrypt = require('bcrypt');


// Database Initalization
require('.././database');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    sqlserver.query(`SELECT * FROM Users WHERE user_Nombre =` + `'${id}'` + ``).then((user) => {
        done(err, user.recordset[0]);
    }).catch((e) => {

    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        let user = await sqlserver.query(`SELECT * FROM Users WHERE user_Nombre =` + `'${email}'` + ``);
        if (user.rowsAffected[0] == 0) {
            console.log('No existe el user');
            return done(null, false, {
                message: 'No existe el user'
            });
        }
        if (user.rowsAffected[0] == 1) {
            try {
                if (await bcrypt.compare(password, user.recordset[0].user_Password)) {
                    console.log(user.recordset);
                    console.log('Usuario Existe');
                    return done(null, user.recordset);
                } else {
                    console.log('Password incorrect');
                    return done(null, false, {
                        message: 'password incorrect'
                    });
                }
            } catch (e) {
                return done(e)
            }
        }
    } catch (e) {

    }
}));