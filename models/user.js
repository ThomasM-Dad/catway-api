const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const User = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Le nom d\'utilisateur est requis']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    }
}, {
    timestamps: true
});

// Hash le mot de passe quand il est modifié
User.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', User);