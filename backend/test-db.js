
const Firebase = require('./firebase');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== TEST IS DB USABLE ===');

async function isDbUsable() {
  const db = Firebase.db;
  if (!db) {
    console.log('❌ db is falsy');
    return false;
  }
  try {
    console.log('Trying to query Firestore...');
    const result = await Promise.race([
      db.collection("memes").limit(1).get(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
    ]);
    console.log('✅ DB is usable, docs:', result.docs.length);
    return true;
  } catch (e) {
    console.log('❌ DB not usable:', e.message);
    console.error(e);
    return false;
  }
}

isDbUsable().then((result) => {
  console.log('Final result:', result);
  process.exit(0);
});
