import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let aiInstance = null;

function getAI() {
  if (!aiInstance) {
    if (!API_KEY) {
      throw new Error('Missing VITE_GEMINI_API_KEY environment variable. Please add it to your .env file.');
    }
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiInstance;
}

/**
 * Convert a File object to a base64-encoded Gemini Part
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze an uploaded house image using Gemini to generate a detailed walkthrough prompt.
 */
export async function analyzeImage(imageFile) {
  const ai = getAI();
  const imagePart = await fileToBase64(imageFile);

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          imagePart,
          {
            text: `You are a professional real estate cinematographer. Analyze this house/property image in detail.

Generate a cinematic video prompt that describes a smooth, professional real estate walkthrough video based on what you see. The prompt should:

1. Start with an establishing exterior shot of the property
2. Describe a smooth camera movement approaching the entrance
3. Describe entering through the front door with a fluid transition
4. Detail room-by-room exploration based on what's visible in the image
5. Include descriptions of lighting, textures, architectural details
6. End with a panoramic view or return to exterior

The prompt should be written as a continuous, cinematic description suitable for AI video generation.
Keep the walkthrough feeling natural and flowing.
Write ONLY the video prompt, nothing else. Keep it under 200 words.`,
          },
        ],
      },
    ],
  });

  return result.text;
}

/**
 * Generate a walkthrough video using Veo via the Gemini API.
 * Accepts the image file and the generated prompt.
 * Returns an object with { videoUrl, videoBlob }.
 * The onProgress callback receives status messages.
 */
export async function generateWalkthroughVideo(imageFile, prompt, onProgress) {
  const ai = getAI();

  onProgress?.('Preparing image for video generation...');

  // Convert the image file to base64 for the Veo API
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  onProgress?.('Starting walkthrough video generation with AI...');

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Data,
      mimeType: imageFile.type,
    },
    config: {
      aspectRatio: '16:9',
      numberOfVideos: 1,
    },
  });

  // Poll until done
  let pollCount = 0;
  while (!operation.done) {
    pollCount++;
    const elapsed = pollCount * 10;
    onProgress?.(`Generating video... (${elapsed}s elapsed). This may take a few minutes.`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation: operation,
    });
  }

  onProgress?.('Video generated! Preparing download...');

  // Get the generated video
  const video = operation.response.generatedVideos[0].video;
  
  // Download the video as a blob
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/${video.uri}?key=${API_KEY}`);
  const videoBlob = await resp.blob();
  const videoUrl = URL.createObjectURL(videoBlob);

  onProgress?.('Video ready!');

  return { videoUrl, videoBlob };
}
