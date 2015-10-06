module.exports = function(app) {
//path.join(__dirname, 'client');
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};