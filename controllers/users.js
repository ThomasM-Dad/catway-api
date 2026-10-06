const userService = require('../services/users');

exports.getAll = async (req, res) => {
    try {
        const users = await userService.getAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getByEmail = async (req, res) => {
    try {
        const user = await userService.getByEmail(req.params.email);
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === 'user_not_found') {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        return res.status(500).json({ message: error.message });
    }
}

exports.add = async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        const user = await userService.add(data);
        return res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        return res.status(400).json({ message: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        const user = await userService.update(req.params.email, data);
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === 'user_not_found') {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        return res.status(400).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        await userService.delete(req.params.email);
        return res.status(204).json('delete_ok');
    } catch (error) {
        if (error.message === 'user_not_found') {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        return res.status(500).json({ message: error.message });
    }
}