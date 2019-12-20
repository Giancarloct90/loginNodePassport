(async () => {
    try {
        const sqlserver = require('mssql');
        const configSQLServer = {
            user: 'sa',
            password: 'Jesucristo1990',
            server: '192.168.0.144\\SQLEXPRESS',
            database: 'seed'
        }
        await sqlserver.connect(configSQLServer);
        console.log('Database Connect');
    } catch (error) {
        console.log(`Error conectar DataBASE`);
    }
})();