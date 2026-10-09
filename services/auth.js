const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (email, password) => {
    if (!email || !password) {
        throw new Error('invalid_credentials');
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
        throw new Error('invalid_credentials');
    }

    const passwordOk = await bcrypt.compare(String(password), user.password);
    if (!passwordOk) {
        throw new Error('invalid_credentials');
    }

    const token = jwt.sign(
        { id: user._id, email:user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        token,
        user : { _id: user._id, username: user.username, email: user.email }
    };
}

exports.getProfile = async(id) => {
    const user = await User.findById(id).select('username email');
    if (!user) {
        throw new Error('user_not_found');
    }
    return user;
}