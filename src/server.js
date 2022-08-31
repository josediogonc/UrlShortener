const app = require('./app.js')
const database = require('./database.js')
const databaseUrl = process.env.DATABASE;

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const spec = YAML.load("./swagger.yml")

app.use('/', swaggerUI.serve, swaggerUI.setup(spec))

const { MongoClient } = require('mongodb');
MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        app.locals.db = client.db('shortener');
    })
    .catch((err) => console.error('Failed to connect to the database' + err));

app.post('/new', (req, res) => {
    let originalUrl = req.body.url;
    const { db } = req.app.locals;
    database.shortURL(db, originalUrl)
        .then(result => {
            const doc = result.value;
            res.json({
                id: doc._id,
                original_url: doc.original_url,
                short_id: doc.short_id,
                date: doc.date
            });
        })
        .catch(console.error);
});

app.get('/id/:id', (req, res) => {
    const id = req.params.id;
    const { db } = req.app.locals;
    database.checkIfIdExists(db, id)
        .then(doc => {
            if (doc === null) return res.send('We could not find a URL at that id');
            res.json({
                original_url: doc.original_url,
            });
        })
        .catch(console.error);
});

app.get('/date/:date', (req, res) => {
    const date = req.params.date.replaceAll('-','/');
    const { db } = req.app.locals;
    database.getAllFromDate(db, date).toArray()
        .then(doc => {
            if (doc === null) return res.send('We could not find any URL at that date');
            var list = []
            doc.forEach(function(element) {
                list.push(element.original_url)
            })
            res.json({ urls: list});
        })
        .catch(console.error);
});

app.get('/url/:shorted', (req, res) => {
    const shortId = req.params.shorted;
    const { db } = req.app.locals;
    database.checkIfShortIdExists(db, shortId)
        .then(doc => {
            if (doc === null) return res.send('We could not find a link at that URL');
            res.json({
                original_url: doc.original_url,
            });
        })
        .catch(console.error);
});

app.set('port', process.env.PORT || 4100);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
