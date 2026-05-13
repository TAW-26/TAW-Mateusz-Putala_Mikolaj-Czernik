const User = require('../models/User');
const Trip = require('../models/Trip');
const Waypoint = require('../models/Waypoint');

exports.updateUserProfile = async (userId, updateData) => {
    const fieldsToUpdate = {
        username: updateData.username,
        email: updateData.email,
        preferences: updateData.preferences
    };

    // Usuwamy undefined
    Object.keys(fieldsToUpdate).forEach(
        key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    return await User.findByIdAndUpdate(userId, fieldsToUpdate, {
        new: true,
        runValidators: true
    }).select('-password');
};

exports.changeUserPassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new Error("Nie znaleziono użytkownika");

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) throw new Error("Obecne hasło jest nieprawidłowe");

    user.password = newPassword;
    return await user.save();
};

exports.getGlobalStats = async () => {
    const userCount = await User.countDocuments();
    const tripCount = await Trip.countDocuments();
    return {
        totalUsers: userCount,
        totalTrips: tripCount,
        serverStatus: "Online",
        lastChecked: new Date().toLocaleString('pl-PL')
    };
};

exports.updateRole = async (userId, role) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("Nie znaleziono użytkownika");
    if (user.email === 'superadmin@voyager.pl') throw new Error("Nie można zmienić roli głównego administratora!");

    user.role = role;
    return await user.save();
};

exports.fetchUsers = async () => {
    return await User.find().select('-password');
};

// Twoja kaskada, którą już mamy
exports.deleteUserCompletely = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("Nie znaleziono użytkownika");
    if (user.email === 'superadmin@voyager.pl') throw new Error("Nie można usunąć Super Admina");

    const userTrips = await Trip.find({ user: userId });
    const tripIds = userTrips.map(t => t._id);

    if (tripIds.length > 0) {
        await Waypoint.deleteMany({ trip: { $in: tripIds } });
    }
    await Trip.deleteMany({ user: userId });
    return await User.findByIdAndDelete(userId);
};