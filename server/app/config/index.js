const config = {
    db:{
        mysql:
            {
                "development": {
                    "username": "root",
                    "password": "root",
                    "database": "messanger",
                    "host": "localhost",
                    "dialect": "mysql"
                },
                "production": {
                    "username": "root",
                    "password": "root",
                    "database": "db_production",
                    "host": "localhost",
                    "dialect": "mysql"
                }
        }
    },
    port:3001
};

module.exports = config;