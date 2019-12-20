app.get('/', async (req, res) => {
    try {
        let empleado = await sqlserver.query('SELECT * FROM Users');
        res.status(200).json(empleado.recordset);
    } catch (error) {
        res.status(400).json({
            ok: false,
            message: 'Error'
        });
    }
});


(async () => {
    try {
        await app.listen(3000);
        console.log('Server On Listen at port 3000');
    } catch (e) {
        console.log(`Error Init Server`, e);
    }
})();


passport.serializeUser((userF, done) => {
    done(null, userF.user_Codigo);
});

passport.deserializeUser((id, done) => {
    let users = await sqlserver.query(`SELECT * FROM Users WHERE user_Codigo = ${id}`);
    done(null, user.id);
});

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
bcrypt.hash(password, bcrypt.genSaltSync(10))
    .then((hash) => {
        try {
            let users = await sqlserver.query(`INSERT INTO Users (user_Nombre, user_Password) VALUES ('${email}','${hash}')`);
            console.log(users);
            let userF = users.recordset[0];

            done(null, userF);
        } catch (error) {
            console.log('Error Insert');
        }
    })
    .catch((err) => {
        console.log('Error to hash the passss');
    });