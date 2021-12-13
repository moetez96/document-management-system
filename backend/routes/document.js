const express = require('express');
const route = express.Router();
const Document = require('../models/document');
const multer = require('multer');
const fs = require('fs')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: fileStorageEngine });

route.post('/getFile', (req, res, next) => {
    res.download('./storage/' + req.body.file, req.body.file, (err) => {
        if (err) {
            next(err);
        }
    })
})
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
    var document = {};

    if (!req.file) {
        document = {
            fullName: req.body.fullName,
            description: req.body.description,
            date: new Date(),
        }
    } else {
        document = {
            fullName: req.body.fullName,
            description: req.body.description,
            date: new Date(),
            doc: req.file.filename
        }
    }

    Document.findByIdAndUpdate(req.params.id, document)
        .then((data) => {
            if (!data) {
                if (req.file) {
                    fs.unlink('storage/' + req.file.filename, (err) => {
                        if (err) throw err;
                    })
                }
                res.send('document dont exist')
            } else {
                if (req.file) {
                    fs.unlink('storage/' + data.doc, (err) => {
                        if (err) throw err;
                    })
                    console.log('file updated!');
                }
            }
            res.send({ message: 'updated' })
        }).catch(err => {
            if (req.file) {
                fs.unlink('storage/' + req.file.filename, (err) => {
                    if (err) throw err;
                })
            }
            res.send(err)
        })
});

route.delete('/delete/:id', (req, res) => {

    Document.findByIdAndRemove(req.params.id)
        .then((data) => {
            if (!data) {
                res.send('document dont exist')
            }
            if (fs.existsSync('storage/' + data.doc)) {
                fs.unlink('storage/' + data.doc, (err) => {
                    if (err) throw err;
                    console.log('file deleted!');
                })
            }
            console.log("deleted")
            res.send({ message: "deleted" })
        })
        .catch(err => res.send(err.message));

});

module.exports = route