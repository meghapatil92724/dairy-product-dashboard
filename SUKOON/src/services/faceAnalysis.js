// Face Analysis Service using face-api.js
import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadFaceModels = async () => {
  if (modelsLoaded) return true;
  try {
    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    return true;
  } catch (error) {
    console.error('Error loading face models:', error);
    return false;
  }
};

export const detectExpression = async (videoOrImageElement) => {
  if (!modelsLoaded) {
    const loaded = await loadFaceModels();
    if (!loaded) return null;
  }
  try {
    const detection = await faceapi
      .detectSingleFace(videoOrImageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detection) return null;

    const expressions = detection.expressions;
    const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];

    return {
      dominant,
      scores: Object.fromEntries(sorted),
    };
  } catch (error) {
    console.error('Expression detection error:', error);
    return null;
  }
};

const greetings = {
  happy: [
    "You're glowing today! 🌟 That smile is contagious.",
    "Great to see you in high spirits! Let's keep that energy going. ✨",
    "Your happiness lights up the room! What's making your day great?",
  ],
  sad: [
    "I can see today might be tough. Remember, it's okay not to be okay. 💜",
    "Sending you a warm hug. I'm here to listen whenever you're ready. 🤗",
    "Every storm passes. Let's take this one moment at a time, together. 🌈",
  ],
  angry: [
    "I can sense some frustration. Take a deep breath — I'm here for you. 🌿",
    "It's okay to feel this way. Let's talk through what's on your mind. 💛",
    "Your feelings are valid. Would a breathing exercise help right now?",
  ],
  fearful: [
    "You're safe here. Whatever you're feeling, we'll work through it together. 🕊️",
    "Courage isn't the absence of fear — it's moving forward despite it. 💜",
    "Take a slow, deep breath. You're stronger than you think. 🌿",
  ],
  disgusted: [
    "Something's bothering you. Let's talk about it in a safe space. 💚",
    "I'm here to listen without judgment. What's on your mind? 🌱",
  ],
  surprised: [
    "Something unexpected? Life is full of surprises! Let's explore it. ✨",
    "That's quite a look! Tell me what's going on. 🌟",
  ],
  neutral: [
    "Hey there! Ready for a calm, peaceful session? 🌸",
    "Welcome back! Let's make this moment count. 🧘",
    "A balanced mind is a powerful mind. Let's get started! 🍃",
  ],
};

export const getGreeting = (expression) => {
  const pool = greetings[expression] || greetings.neutral;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getExpressionEmoji = (expression) => {
  const emojis = {
    happy: '😊',
    sad: '😢',
    angry: '😤',
    fearful: '😰',
    disgusted: '😣',
    surprised: '😮',
    neutral: '😌',
  };
  return emojis[expression] || '😌';
};

export const getMoodValue = (expression) => {
  const values = {
    happy: 5,
    surprised: 4,
    neutral: 3,
    sad: 2,
    fearful: 2,
    angry: 1,
    disgusted: 1,
  };
  return values[expression] || 3;
};
