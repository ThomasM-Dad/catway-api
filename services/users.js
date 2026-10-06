const User = require('../models/user');

exports.getAll = async () => {
    return await User.find().select('-password');
}

exports.getByEmail = async (email) => {
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
        throw new Error('user_not_found');
    }
    return user;
}

exports.add = async (data) => {
    const user = await User.create(data);
    const result = user.toObject();
    delete result.password;
    return result;
}

exports.update = async (email, data) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('user_not_found');
    }

    Object.keys(data).forEach((key) => {
        if (!!data[key]) {
            user[key] = data[key];
        }
    });

    await user.save();
    const result = user.toObject();
    delete result.password;
    return result;
}

exports.delete = async (email) => {
    const result = await User.deleteOne({ email });
    if (result.deletedCount === 0) {
        throw new Error('user_not_found');
    }
}