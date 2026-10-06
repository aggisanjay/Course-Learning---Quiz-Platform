const { connectDB, closeDB } = require('./config/db');
const Course = require('./models/Course');

async function updateThumbnail() {
  await connectDB();
  try {
    const updated = await Course.updateMany(
      { slug: 'javascript-advanced-concepts' },
      { $set: { thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' } }
    );
    console.log(`[Update] Matched and updated: ${updated.modifiedCount} course(s)`);
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await closeDB();
    process.exit(0);
  }
}

updateThumbnail();
