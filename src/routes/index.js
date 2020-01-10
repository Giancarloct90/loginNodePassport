const express = require('express');
const router = express.Router();
const sqlserver = require('mssql');
const bcrypt = require('bcrypt');
const passport = require('passport');


// Inizialate DB
require('.././database');

router.get('/', async (req, res, next) => {
    res.render('index');
});

// GET SIGNIN VIEW, to see the page to signup for signup
router.get('/signup', async (req, res) => {
    res.render('signup');
});

// GET VIEWUSERS VIEW, to see all user in the database
router.get('/viewUsers', async (req, res) => {
    try {
        let empleado = await sqlserver.query('SELECT * FROM Users');
        res.status(200).json({
            ok: true,
            users: empleado.recordset
        });
    } catch (e) {
        console.log(`Error ${e}`);
    }

});

// POST SIGNUP VIEW, user send his info to saved into database
router.post('/signup', async (req, res) => {
    let email = req.body.email;
    let pass = req.body.password;

    try {
        let user = await sqlserver.query(`SELECT * FROM Users WHERE user_Email =` + `'${email}'` + ``);
        if (user.rowsAffected[0] >= 1) {
            console.log('EL usuario ya existe ingrese otro email');
            res.status(406).json({
                ok: false,
                message: 'EL usuario ya existe ingrese otro email'
            });
        } else {
            bcrypt.hash(pass, 10).then(async (hashedPass) => {
                try {
                    let user = await sqlserver.query(`INSERT INTO Users (user_Email, user_Password) VALUES ('${email}','${hashedPass}')`);
                    if (user.rowsAffected[0] == 1) {
                        res.json({
                            ok: true,
                            email: email,
                            passHashed: hashedPass
                        })
                    } else {
                        res.json({
                            ok: false,
                            message: 'Error 01DB '
                        });
                    }
                } catch (e) {
                    console.log('Error Insert');
                }
            }).catch(e => console.log('Error Hashing'));
        }
    } catch (e) {
        console.log(e);
        res.json({
            ok: false,
            message: 'Error Buscando el email'
        });
    }
});

// GET SIGIN VIEW, to see sigin page for signin
router.get('/signin', (req, res, next) => {
    res.render('signin');
});

// POST SIGNIN VIEW, User send hsi info for verication here
router.post('/signin', async (req, res, next) => {

    let email = req.body.email;
    let pass = req.body.password;
    console.log(`Emial: ${email} , Pass: ${pass}`);
    try {
        let user = await sqlserver.query(`SELECT * FROM Users WHERE user_Email =` + `'${email}'` + ``);
        if (user.rowsAffected[0] == 1) {
            if (await bcrypt.compare(pass, user.recordset[0].user_Password)) {
                console.log('User Exist');
                res.send('User Exist');
            } else {
                console.log('User Doesnt Exist');
                res.send('User Doesnt Exist');
            }
        }
    } catch (e) {
        console.log(e);
    }
});


// POST SIGNIN2 VIEW, User send his credential here for verification
router.post('/signin2', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));


function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// POST PROFILE VIEW, After signin user 
router.get('/profile', isAuth, (req, res) => {
    res.render('profile');
});

// LOGOUT VIEW,
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});
module.exports = router;