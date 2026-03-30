import { isMock, saveChatMessage } from './firebase';

// REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY
const GEMINI_API_KEY = "AIzaSyDYHz3ykunVRGujCiCaUiXumD4EdlShqqQ"

export const getAIResponse = async (chatHistory, userMessage, detectedEmotion = "neutral", retries = 1) => {
  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    console.error("Gemini API Key missing.");
    return "I am currently disconnected from my AI intelligence. Please add your Gemini API Key in src/services/ai.js";
  }

  try {
    const previousConversation = chatHistory
      .filter(msg => msg.id !== 'greeting')
      .map(msg => `${msg.sender === 'user' ? 'User' : 'SukoonAI'}: ${msg.text}`)
      .join('\n');

    const prompt = `You are SukoonAI, a mental wellness assistant.

User message: ${userMessage} ${detectedEmotion !== "neutral" ? `[Emotion: ${detectedEmotion}]` : ""}

Previous conversation:
${previousConversation}

Rules:
- Never repeat previous responses.
- Never give the same sentence twice.
- Always generate a fresh and unique reply.
- Answer directly to the user's question.
- Be human-like and supportive.

If the same response is about to be generated, change it completely.

Answer:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 150
        }
      })
    });

    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Full API Response:", data);

    if (!response.ok) {
      console.error("Gemini API Error Response:", data);
      
      if (retries > 0) {
        console.log("Retrying Gemini API call...");
        return await getAIResponse(chatHistory, userMessage, detectedEmotion, retries - 1);
      }
      return "Sorry, something went wrong. Please try again.";
    }

    if (data.error) {
      console.error("Gemini API Error:", data.error.message);
      if (retries > 0) {
        console.log("Retrying Gemini API call...");
        return await getAIResponse(chatHistory, userMessage, detectedEmotion, retries - 1);
      }
      return "Sorry, something went wrong. Please try again.";
    }

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!aiText) {
      throw new Error("No text candidates found");
    }

    return aiText;

  } catch (err) {
    console.error("Error calling Gemini API:", err);
    if (retries > 0) {
      console.log("Retrying Gemini API call...");
      return await getAIResponse(chatHistory, userMessage, detectedEmotion, retries - 1);
    }
    return "Sorry, something went wrong. Please try again.";
  }
};

export const getAIGreeting = async (detectedEmotion) => {
  const emotion = detectedEmotion.toLowerCase();

  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    if (emotion === 'happy') return "Nice to see you smiling 😊 How is your day going?";
    if (emotion === 'sad') return "Hey, I’m here for you 💙 Want to talk about what's on your mind?";
    return "Hello! How are you feeling today?";
  }

  try {
    const prompt = `The user has just opened the mental wellness app. Their face shows a '${detectedEmotion}' expression. Generate a gentle, empathetic 1-2 sentence greeting and end with a question asking how they are doing.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 50 }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return data.candidates[0].content.parts[0].text.replace(/["*]/g, '').trim();
  } catch (err) {
    console.error("Greeting generation failed:", err);
    return "Hello! How are you feeling today?";
  }
};
