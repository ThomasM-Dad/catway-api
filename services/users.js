const User = require('../models/user');

// Récupérer tous les utilisateurs
exports.getAll = async (req, res, next) => {
    try {
        let users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// Récupérer un utilisateur par email
exports.getByEmail = async (req, res, next) => {
    const email = req.params.email;

    try {
        let user = await User.findOne({ email }).select('-password');

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json(error);
    }
}

// Créer un utilisateur
exports.add = async (req, res, next) => {
    const temp = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        let user = await User.create(temp);
        user = user.toObject();
        delete user.password;

        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Modifier un utilisateur (identifié par email)
exports.update = async (req, res, next) => {
    const email = req.params.email;
    const temp = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        let user = await User.findOne({ email });

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            user = user.toObject();
            delete user.password;

            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(400).json(error);
    }
}

// Supprimer un utilisateur (identifié par email)
exports.delete = async (req, res, next) => {
    const email = req.params.email;

    try {
        await User.deleteOne({ email });
        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(500).json(error);
    }
}