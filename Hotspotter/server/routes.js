module.exports = function(app) {
// =============================Server Routes ===========================================================
   //TODO: These will be our api routes
   //
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};