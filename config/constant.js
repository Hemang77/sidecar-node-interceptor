module.exports = {
    'authentication': {
        'authTokenExpiry': '1d',
        'refreshTokenExpiry': '3d'
    },
    'statusCodes': { 'SUCCESS': '1', 'FAIL': '0', 'VALIDATION': '2', 'UNAUTHENTICATED': '-1', 'NOT_FOUND': '-2' },
    'baseUrl': 'http://localhost:6000/v1/'
}