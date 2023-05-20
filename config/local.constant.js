module.exports = {
    'MONGODB_URI': '',

    'PORT': 4000,
    'NODE_ENV': 'local',
    "serverConfig": {
        "CORS": {
            "allowedHosts": ['http://localhost:4000']
        }
    },
    "jwtAuthSecret": "secret",
    "jwtRefreshSecret": "secretrefresh"
}