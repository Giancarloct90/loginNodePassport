const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sqlserver = require('mssql');
const passport = require('passport');


// Inizialate DB
require('.././database');

router.get('/', async (req, res, next) => {
    let users = await sqlserver.query('SELECT * FROM Users');
    //console.log(users.recordset);
    res.render('index');
});

router.get('/signup', async (req, res) => {

    res.render('signup');
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


router.get('/signupUser', async (req, res) => {
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

router.post('/signup', (req, res) => {
    let email = req.body.email;
    let pass = req.body.password;
    // console.log(`Nombre ${email}`);
    // console.log(`Pass ${pass}`);
    bcrypt.hash(pass, 10).then(async (hashedPass) => {
        try {
            let user = await sqlserver.query(`INSERT INTO Users (user_Nombre, user_Password) VALUES ('${email}','${hashedPass}')`);
            if (user.rowsAffected[0] == 1) {
                res.json({
                    ok: true,
                    email: email,
                    passHashed: hashedPass
                })
            }
            res.json({
                ok: false,
                message: 'Error 01DB '
            });
        } catch (e) {
            console.log('Error Insert');
        }
    }).catch(e => console.log('Error Hashing'));

});

router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', async (req, res, next) => {

    let email = req.body.email;
    let pass = req.body.password;
    console.log(`Emial: ${email} , Pass: ${pass}`);
    try {
        let user = await sqlserver.query(`SELECT * FROM Users WHERE user_Nombre =` + `'${email}'` + ``);
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



router.post('/signin2', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

router.get('/profile', (req, res) => {
    res.render('profile');
});

module.exports = router;