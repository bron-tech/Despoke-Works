import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { GenerationParams, GeneratedImage, AISuggestion } from '../types';
import { PRE_BUILT_BACKGROUNDS, STYLING_OPTIONS, PHOTOGRAPHY_OPTIONS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const urlToGenerativePart = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
  return {
    inlineData: { data: base64EncodedData, mimeType: blob.type }
  };
};

const buildPrompt = (params: GenerationParams): string => {
  const { modelConfig, stylingConfig, photographyConfig } = params;

  let modelDescription: string;
  if (modelConfig.type === 'upload' && modelConfig.uploadedPhoto) {
    modelDescription = "The person in the provided photo";
    if (modelConfig.modelDescription.trim()) {
      modelDescription += `, modified to have these characteristics: ${modelConfig.modelDescription.trim()}`;
    }
  } else {
    if (modelConfig.modelDescription.trim()) {
      modelDescription = modelConfig.modelDescription.trim();
    } else {
      modelDescription = `A fashion model, ${modelConfig.ethnicity}, ${modelConfig.bodyType}, ${modelConfig.hairstyle} hair, in their ${modelConfig.age}, with a ${modelConfig.skinTone} skin tone.`;
    }
  }

  let styleDescription: string;
  if (stylingConfig.styleDescription.trim()) {
    styleDescription = `The model is wearing clothing described as: ${stylingConfig.styleDescription.trim()}.`;
  } else {
    styleDescription = `The model is wearing a ${stylingConfig.fit} outfit in a ${stylingConfig.style} style, with brand inspiration from ${stylingConfig.brand}.`;
  }

  let backgroundPromptPart: string;
  const { backgroundType, backgroundDescription, preBuiltBackgroundId } = photographyConfig;
  
  if (backgroundType === 'upload' || (backgroundType === 'pre-built' && preBuiltBackgroundId)) {
    backgroundPromptPart = 'The model should be placed seamlessly and realistically into the provided background image. The lighting on the model should match the background\'s lighting conditions, shadows, and overall ambiance.';
    if(backgroundDescription.trim()) {
      backgroundPromptPart += ` Additional context for the scene: ${backgroundDescription.trim()}`;
    }
  } else {
    backgroundPromptPart = `The scene is described as: ${backgroundDescription.trim() || 'a neutral studio background'}`;
  }

  const photographyDescription = `The photograph is taken with a ${photographyConfig.camera} and a ${photographyConfig.lens}. The look is ${photographyConfig.look} with ${photographyConfig.lighting} lighting. ${backgroundPromptPart} and the mood is ${photographyConfig.mood}.`;
  
  return `Create a high-end, photorealistic fashion photoshoot image. ${modelDescription} ${styleDescription} ${photographyDescription}`;
};

export const generateImages = async (params: GenerationParams): Promise<GeneratedImage[]> => {
  console.log('Generating images with params:', params);
  
  const { modelConfig, photographyConfig } = params;
  const formats: GeneratedImage['format'][] = ['Editorial', 'E-commerce', 'Social'];
  const generatedImages: GeneratedImage[] = [];

  for (const format of formats) {
    let specificParams = { ...params };
    let mood = photographyConfig.mood;
    let look = photographyConfig.look;

    if (format === 'E-commerce') {
        mood = 'E-commerce';
        look = 'Sharp Digital';
    } else if (format === 'Social') {
        mood = 'Social Content';
        look = 'Candid';
    }
    specificParams.photographyConfig = { ...photographyConfig, mood, look };
    
    const prompt = buildPrompt(specificParams);
    const parts: any[] = [];
    
    const modelImageProvided = modelConfig.type === 'upload' && modelConfig.uploadedPhoto;
    const backgroundImageProvided = photographyConfig.backgroundType === 'upload' && photographyConfig.uploadedBackground;
    const prebuiltBackgroundProvided = photographyConfig.backgroundType === 'pre-built' && photographyConfig.preBuiltBackgroundId;

    if (backgroundImageProvided) {
      parts.push(await fileToGenerativePart(photographyConfig.uploadedBackground!));
    } else if (prebuiltBackgroundProvided) {
      const background = PRE_BUILT_BACKGROUNDS.find(b => b.id === photographyConfig.preBuiltBackgroundId);
      if (background) {
        parts.push(await urlToGenerativePart(background.image));
      }
    }

    if (modelImageProvided) {
      parts.push(await fileToGenerativePart(modelConfig.uploadedPhoto!));
    }
    
    parts.push({ text: prompt });

    const useImageModel = modelImageProvided || backgroundImageProvided || prebuiltBackgroundProvided;
    let src: string | undefined;

    try {
      if (useImageModel) {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts },
              config: {
                  responseModalities: [Modality.IMAGE],
              },
          });
          
          const firstPart = response.candidates?.[0]?.content?.parts?.[0];
          if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
              const base64ImageBytes = firstPart.inlineData.data;
              src = `data:${firstPart.inlineData.mimeType};base64,${base64ImageBytes}`;
          }
      } else {
          const response = await ai.models.generateImages({
              model: 'imagen-4.0-generate-001',
              prompt: prompt,
              config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: photographyConfig.aspectRatio,
              },
          });
          if (response.generatedImages && response.generatedImages.length > 0) {
              const base64ImageBytes = response.generatedImages[0].image.imageBytes;
              src = `data:image/jpeg;base64,${base64ImageBytes}`;
          }
      }
    } catch (e) {
      console.error(`Error generating image for format ${format}:`, e);
      if (e instanceof Error) {
        throw new Error(`Failed on ${format} image generation. ${e.message}`);
      }
      throw e;
    }


    if (src) {
        generatedImages.push({
          src,
          format,
          metadata: { ...params.modelConfig, ...params.stylingConfig, ...specificParams.photographyConfig },
          aspectRatio: photographyConfig.aspectRatio,
        });
    } else {
        console.error(`Failed to generate image for format: ${format}, no image data in response.`);
    }
  }

  if (generatedImages.length === 0) {
    throw new Error("Image generation failed to produce any results. Please check the console for errors and try again.");
  }
  
  return generatedImages;
};


export const getSuggestions = async (params: GenerationParams, suggestionType: 'styling' | 'photography'): Promise<AISuggestion[]> => {
    const { modelConfig, stylingConfig, photographyConfig } = params;

    const currentConfig = `
      - Model: ${modelConfig.modelDescription || `${modelConfig.ethnicity}, ${modelConfig.bodyType}, ${modelConfig.hairstyle}`}
      - Styling: ${stylingConfig.styleDescription || `${stylingConfig.fit}, ${stylingConfig.style}, ${stylingConfig.brand} brand`}
      - Photography: ${photographyConfig.backgroundDescription || `A scene with ${photographyConfig.lighting} lighting and a ${photographyConfig.mood} mood.`}
    `;

    const prompt = suggestionType === 'styling'
    ? `You are an expert fashion stylist. Based on the current photoshoot setup, suggest 3 distinct and compelling styling variations. For each suggestion, provide a creative title, a short description, and specific changes for "fit", "style", and "brand". Only suggest values from these available options: Fits: ${STYLING_OPTIONS.fits.join(', ')}. Styles: ${STYLING_OPTIONS.styles.join(', ')}. Brands: ${STYLING_OPTIONS.brands.join(', ')}. Current setup: ${currentConfig}.`
    : `You are an expert fashion photographer. Based on the current photoshoot setup, suggest 3 distinct and compelling photography variations. For each suggestion, provide a creative title, a short description, and specific changes for "camera", "lens", "look", "lighting", and "mood". Only suggest values from these available options: Cameras: ${PHOTOGRAPHY_OPTIONS.cameras.join(', ')}. Lenses: ${PHOTOGRAPHY_OPTIONS.lenses.join(', ')}. Looks: ${PHOTOGRAPHY_OPTIONS.looks.join(', ')}. Lightings: ${PHOTOGRAPHY_OPTIONS.lightings.join(', ')}. Moods: ${PHOTOGRAPHY_OPTIONS.moods.join(', ')}. Current setup: ${currentConfig}.`;

    const stylingSchema = {
        type: Type.OBJECT,
        properties: {
            fit: { type: Type.STRING, enum: STYLING_OPTIONS.fits },
            style: { type: Type.STRING, enum: STYLING_OPTIONS.styles },
            brand: { type: Type.STRING, enum: STYLING_OPTIONS.brands },
        },
    };

    const photographySchema = {
        type: Type.OBJECT,
        properties: {
            camera: { type: Type.STRING, enum: PHOTOGRAPHY_OPTIONS.cameras },
            lens: { type: Type.STRING, enum: PHOTOGRAPHY_OPTIONS.lenses },
            look: { type: Type.STRING, enum: PHOTOGRAPHY_OPTIONS.looks },
            lighting: { type: Type.STRING, enum: PHOTOGRAPHY_OPTIONS.lightings },
            mood: { type: Type.STRING, enum: PHOTOGRAPHY_OPTIONS.moods },
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            config: {
                                type: Type.OBJECT,
                                properties: {
                                    ...(suggestionType === 'styling' ? { stylingConfig: stylingSchema } : {}),
                                    ...(suggestionType === 'photography' ? { photographyConfig: photographySchema } : {}),
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText);
        
        // Basic validation
        if (!Array.isArray(suggestions)) {
            throw new Error("AI response is not an array.");
        }

        return suggestions as AISuggestion[];
    } catch (e) {
        console.error("Error getting AI suggestions:", e);
        throw new Error("The AI creative director is busy, please try again in a moment.");
    }
}