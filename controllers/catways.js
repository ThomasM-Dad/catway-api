const catwayService = require('../services/catways');

exports.getAll = async (req, res) => {
    try {
        const catways = await catwayService.getAll();
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getByNumber = async (req, res) => {
    try {
        const catway = await catwayService.getByNumber(req.params.id);
        return res.status(200).json(catway);
    } catch (error) {
        if (error.message === 'catway_not_found') {
            return res.status(404).json({ message: 'Catway introuvable' });
        }
        return res.status(500).json({ message: error.message });
    }
}

exports.add = async (req, res) => {
    try {
        const data = {
            catwayNumber: req.body.catwayNumber,
            catwayType: req.body.catwayType,
            catwayState: req.body.catwayState
        };
        const catway = await catwayService.add(data);
        return res.status(201).json(catway);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const catway = await catwayService.update(req.params.id, req.body.catwayState);
        return res.status(200).json(catway);
    } catch (error) {
        if (error.message === 'catway_not_found') {
            return res.status(404).json({ message: 'Catway introuvable' });
        }
        return res.status(400).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        await catwayService.delete(req.params.id);
        return res.status(204).json('delete_ok');
    } catch (error) {
        if (error.message === 'catway_not_found') {
            return res.status(404).json({ message: 'Catway introuvable' });
        }
        return res.status(500).json({ message: error.message });
    }
}