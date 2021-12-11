const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: Date,
    doc: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Document', documentSchema);