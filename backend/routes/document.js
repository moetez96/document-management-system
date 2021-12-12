const express = require('express');
const route = express.Router();
const Document = require('../models/document');
const multer = require('multer');
const fs = require('fs')
const { resolve } = require('path')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: fileStorageEngine });

route.post('/create', upload.single('doc'), (req, res) => {
    console.log(req.file)
    var document = new Document({
        fullName: req.body.fullName,
        description: req.body.description,
        date: new Date(),
        doc: req.file.filename
    });

    document.save()
        .then(data => {
            res.send(data)
        })
        .catch(err => res.send(err.message))
});

route.get('/', (req, res) => {
    Document.find()
        .then(data => res.send(data))
        .catch(err => res.send(err.message))
});

route.get('/:id', (req, res) => {
    Document.findById(req.params.id)
        .then(data => {
            if (!data) {
                res.send('document dont exist')
            }
            res.send(data)
        })
        .catch(err => res.send(err.message));
});

route.put('/update/:id', upload.single('doc'), (req, res) => {
    console.log(req.body)
    console.log(req.file)
    const document = {
        fullName: req.body.fullName,
        description: req.body.description,
        date: new Date(),
        doc: req.file.filename
    };

    Document.findByIdAndUpdate(req.params.id, document)
        .then(({ doc }) => {
            fs.unlink('storage/' + doc, (err) => {
                if (err) throw err;
                console.log('file deleted!');
            })
            res.send('updated')
        })
        .catch(err => res.send(err.message));
});

route.delete('/delete/:id', (req, res) => {

    Document.findByIdAndRemove(req.params.id)
        .then(({ doc }) => {
            fs.unlink('storage/' + doc, (err) => {
                if (err) throw err;
                console.log('file deleted!');
            })
            res.send("deleted")
        })
        .catch(err => res.send(err.message));

});

module.exports = route