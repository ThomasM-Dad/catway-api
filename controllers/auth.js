const authService = require('../services/auth');

exports.login = async (req, res) => {
    try {
        const { token, user } = await authService.login(req.body.email, req.body.password);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        // Le header est exposé dans la config CORS d'app.js
        res.set('Authorization', `Bearer ${token}`);

        return res.status(200).json({ user });
    } catch (error) {
        if (error.message === 'invalid_credentials') {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }
        return res.status(500).json({ message: error.message });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Déconnexion réussie' });
}