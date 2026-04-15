const mongoose = require('mongoose');
const User = require('./src/models/User'); // upewnij się, że ścieżka do modelu jest poprawna
const dotenv = require('dotenv');

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ Błąd: Brak MONGO_URI w pliku .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);

        const adminEmail = 'superadmin@voyager.pl';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('ℹ️  Super Admin już istnieje w bazie danych.');
            process.exit();
        }

        const superAdmin = new User({
            username: 'SuperAdmin',
            email: adminEmail,
            password: 'TajneHaslo123!',
            role: 'admin'
        });

        await superAdmin.save();
        console.log('✅ Super Admin utworzony pomyślnie!');
        console.log('📧 Email: ' + adminEmail);
        console.log('🔑 Hasło: TajneHaslo123!');

        process.exit();
    } catch (err) {
        console.error('❌ Błąd podczas tworzenia admina:', err);
        process.exit(1);
    }
};

seedSuperAdmin();