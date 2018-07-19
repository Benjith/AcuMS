module.exports = (app) => {
    app.get('/login', (req, res,next) => {
        req.session.destroy();
        res.render('login');
        next();
    });
};