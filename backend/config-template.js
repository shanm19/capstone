/* capstone config.js */

// Contains api keys and passwords and is not pushed to Github.

process.env.PORT =  8080;

module.exports = {
    db_host: "ip address:port number",
    db_name: "name of database",
    db_user: "database connection username",
    db_pass: "database connection password",
    db_secret: "secret for jwt token authentication",
    facebookAuth: {
        clientID: "FB app client ID",
        clientSecret: "FB app client secret",
        callbackURL: "FB OAuth2 callback url"
    },
    googleAuth: {
        clientID: "Google app client ID",
        clientSecret: "Google app secret",
        callbackURL: "Google OAuth2 callback url"
    }
};
