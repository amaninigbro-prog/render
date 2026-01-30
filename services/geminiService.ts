import { GoogleGenAI } from "@google/genai";

// The fixed prompt as required by the user
const SYSTEM_PROMPT = `RAW photo, phone camera realism, ultra-realistic real-life image with the atmosphere of a typical Indonesian residential neighborhood. Apply to any input photo while preserving the original appearance, structure, scale, proportions, and layout exactly as shown. Maintain identical composition, framing, perspective, object positions, shapes, and sizes. Do not modify, resize, redesign, or reposition any existing element. Add only one realistic Gojek motorcycle passing by naturally on the street. Strict photorealism.`;

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generates the architectural render using Gemini.
 * @param imageFile The uploaded image file.
 */
export const generateRender = async (imageFile: File): Promise<string> => {
  try {
    // Initialize the client with the environment API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imageBase64 = await fileToGenerativePart(imageFile);
    
    // Use gemini-2.5-flash-image for standard speed and general access
    const modelId = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: imageBase64
            }
          },
          {
            text: SYSTEM_PROMPT
          }
        ]
      }
    });

    // Iterate through parts to find the image output
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct the data URL for the image
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("The AI model did not return an image. Please try again with a different photo.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Try to extract a more meaningful error message if available
    let errorMessage = error.message;
    if (error.response) {
       errorMessage = JSON.stringify(error.response);
    }
    
    throw new Error(errorMessage || "Failed to generate image. Please verify your API key and try again.");
  }
};