const API_BASE = 'https://viral-stick.vercel.app/api';

export const generateMemeFromText = async (text) => {
  const response = await fetch(`${API_BASE}/memes/generate-from-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Failed to generate meme');
  return response.json();
};
