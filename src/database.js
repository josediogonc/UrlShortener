const nanoid = require('nanoid');
const { ObjectId } = require('mongodb');
const dateFormatter = require('./dateformatter')

const COLLECTION_NAME = 'shortenedURLs'

const shortURL = (db, url) => {
    const shortenedURLs = db.collection(COLLECTION_NAME);
    return shortenedURLs.findOneAndUpdate({ original_url: url },
        {
            $setOnInsert: {
                original_url: url,
                short_id: nanoid(7),
                date: dateFormatter.currentDateBrazil()
            },
        },
        {
            returnOriginal: false,
            upsert: true,
        }
    );
};

const checkIfShortIdExists = (db, code) => db.collection(COLLECTION_NAME)
  .findOne({ short_id: code });

const checkIfIdExists = (db, code) => db.collection(COLLECTION_NAME)
    .findOne({_id : ObjectId(code)});

const getAllFromDate = (db, code) => db.collection(COLLECTION_NAME)
    .find({date : code});

const getAll = (db) => db.collection(COLLECTION_NAME)
    .find({});

module.exports = { shortURL, checkIfIdExists, checkIfShortIdExists, getAllFromDate, getAll }
