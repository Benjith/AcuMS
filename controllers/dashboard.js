module.exports = (app) => {
    app.get('/dashboard', (req, res, next) => {
        console.log("DASH_RENDER");
        res.render('dashboard', {
            request: req
        });
    });
};