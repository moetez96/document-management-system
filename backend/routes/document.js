const express = require('express');
const route = express.Router();
const Document = require('../models/document');

route.post('/create', (req, res) => {
    const document = new Document({
        fullName: req.body.fullName,
        description: req.body.description,
        date: new Date(),
        doc: req.body.doc
    });

    document.save()
        .then(data => res.send(data))
        .catch(err => res.send(err.message))
});

route.get('/', (req, res) => {
    Document.find()
        .then(data => res.send(data))
        .catch(err => res.send(err.message))
});

route.get('/:id', (req, res) => {
    Document.findById(req.params.id)
        .then(data => res.send(data))
        .catch(err => res.send(err.message));
});

route.put('/update/:id', (req, res) => {
    const document = {
        fullName: req.body.fullName,
        description: req.body.description,
        date: new Date(),
        doc: req.body.doc
    };

    Document.findByIdAndUpdate(req.params.id, document)
        .then(data => res.send(data))
        .catch(err => res.send(err.message));
});

route.delete('/delete/:id', (req, res) => {
    Document.findByIdAndRemove(req.params.id)
        .then(() => res.send("Deleted"))
        .catch(err => res.send(err.message));
});

module.exports = route