const qr = require('qr-image');

module.exports = (app) => {
    app.get('/qr/', (req, res) => {
        const url = decodeURIComponent(req.query.url);
        console.log('qr requested for: ' + url);
        if (url == null) {
            res.send('Invalid data');
        }
        qr.image(url, {
            type: 'svg'
        }).pipe(res);
    });
}