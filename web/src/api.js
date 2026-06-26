
// For local development
const API_BASE = 'http://localhost:3000/api';

// For production
// const API_BASE = 'https://viral-stick.vercel.app/api';

export const generateMemeFromText = async (text) => {
  const response = await fetch(`${API_BASE}/memes/generate-from-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Failed to generate meme');
  return response.json();
};

export const publishMemeToForum = async (data) => {
  const response = await fetch(`${API_BASE}/forum/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to publish meme');
  return response.json();
};

export const getForumMemes = async (sortBy = 'createdAt', userId = null) => {
  const url = new URL(`${API_BASE}/forum/memes`);
  url.searchParams.set('sortBy', sortBy);
  if (userId) url.searchParams.set('userId', userId);
  
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to fetch forum memes');
  return response.json();
};

export const likeMeme = async (id, userId) => {
  const response = await fetch(`${API_BASE}/forum/memes/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error('Failed to like meme');
  return response.json();
};
