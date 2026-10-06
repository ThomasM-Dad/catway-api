const Catway = require('../models/catway');

exports.getAll = async () => {
    return await Catway.find();
}

exports.getByNumber = async (catwayNumber) => {
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
        throw new Error('catway_not_found');
    }
    return catway;
}

exports.add = async (data) => {
    return await Catway.create(data);
}

exports.update = async (catwayNumber, catwayState) => {
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
        throw new Error('catway_not_found');
    }

    // Seul catwayState est modifiable — catwayNumber et catwayType restent figés
    catway.catwayState = catwayState;
    await catway.save();
    return catway;
}

exports.delete = async (catwayNumber) => {
    const result = await Catway.deleteOne({ catwayNumber });
    if (result.deletedCount === 0) {
        throw new Error('catway_not_found');
    }
}