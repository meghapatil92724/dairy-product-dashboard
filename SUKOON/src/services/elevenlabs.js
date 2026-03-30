// ElevenLabs TTS Service with browser SpeechSynthesis fallback

const ELEVENLABS_API_KEY = 'YOUR_ELEVENLABS_API_KEY'; // Replace with your key
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel — calm, warm voice

export const speak = async (text, voiceId = DEFAULT_VOICE_ID) => {
  // Try ElevenLabs first
  if (ELEVENLABS_API_KEY !== 'YOUR_ELEVENLABS_API_KEY') {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        return new Promise((resolve) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
        });
      }
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
    }
  }

  // Fallback to browser SpeechSynthesis
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
