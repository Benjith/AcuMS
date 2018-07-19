module.exports = (app) => {
    app.get('/dashboard', (req, res, next) => {
        res.render('dashboard');
        next();
    });
};