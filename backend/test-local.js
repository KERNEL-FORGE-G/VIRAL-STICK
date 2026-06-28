
const express = require('express');
const app = express();

console.log('=== TEST LOCAL DES ROUTES ===');
console.log('Loading env...');
require('./loadEnv')();
console.log('ENV loaded');

// Test Firebase
console.log('Testing Firebase...');
const Firebase = require('./firebase');
console.log('Firebase db:', !!Firebase.db);

// Test Cloudinary
console.log('Testing Cloudinary...');
const cloudinary = require('./cloudinary');
console.log('Cloudinary ready:', cloudinary.isReady());

// Test Forum Controller getMemes
console.log('Testing ForumController.getMemes...');
const ForumController = require('./controllers/forumController');

// Mock req/res
const mockReq = {
  query: { sortBy: 'createdAt', userId: 'test123' }
};
let mockResult = null;
const mockRes = {
  json: (data) => {
    mockResult = data;
    console.log('✅ getMemes() OK, returned', data.length, 'memes!');
    console.log('First meme:', data[0]);
  },
  status: () => mockRes
};

ForumController.getMemes(mockReq, mockRes);

console.log('\n=== LOCAL TEST SUCCESSFUL! ===');
