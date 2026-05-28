/**
 * Seed script — populates the database with default users.
 *
 * Usage:
 *   node seed.js           → seeds default users (skips existing emails)
 *   node seed.js --fresh   → drops ALL users first, then seeds
 *
 * Run from the backend directory:
 *   cd backend && node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// ─── Default seed data ───────────────────────────────────────────────────────
admin@cashive.com
const SEED_USERS = [
  {
    name: 'Super Admin',
    email: '',
    password: 'Admin@1234',
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Factory Manager',
    email: 'manager@cashive.com',
    password: 'Manager@1234',
    role: 'manager',
    isActive: true,
  },
  {
    name: 'Floor Staff',
    email: 'staff@cashive.com',
    password: 'Staff@1234',
    role: 'staff',
    isActive: true,
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  MongoDB connected:', mongoose.connection.host);

    const isFresh = process.argv.includes('--fresh');

    if (isFresh) {
      await User.deleteMany({});
      console.log('🗑️   Dropped all existing users (--fresh flag).');
    }

    let created = 0;
    let skipped = 0;

    for (const userData of SEED_USERS) {
      const exists = await User.findOne({ email: userData.email });
      if (exists) {
        console.log(`⏭️   Skipped  ${userData.email}  (already exists)`);
        skipped++;
        continue;
      }

      // Password is hashed automatically by the pre-save hook in User model
      await User.create(userData);
      console.log(`✔️   Created  ${userData.email}  [${userData.role}]`);
      created++;
    }

    console.log('\n─────────────────────────────────────────');
    console.log(`Seed complete — ${created} created, ${skipped} skipped.`);
    console.log('─────────────────────────────────────────');
    console.log('\nDefault credentials:');
    SEED_USERS.forEach((u) => {
      console.log(`  ${u.role.padEnd(10)}  ${u.email.padEnd(28)}  password: ${u.password}`);
    });
    console.log('');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌  MongoDB disconnected.');
  }
};

seed();
