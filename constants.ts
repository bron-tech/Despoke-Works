import type { InspirationItem } from './types';

export const PRE_BUILT_MODELS = [
  { id: 'model-1', name: 'Alani', ethnicity: 'Black', image: 'https://picsum.photos/id/1027/400/600' },
  { id: 'model-2', name: 'Kenji', ethnicity: 'Asian', image: 'https://picsum.photos/id/1005/400/600' },
  { id: 'model-3', name: 'Sofia', ethnicity: 'White', image: 'https://picsum.photos/id/1011/400/600' },
  { id: 'model-4', name: 'Ravi', ethnicity: 'Indian', image: 'https://picsum.photos/id/30/400/600' },
  { id: 'model-5', name: 'Chen', ethnicity: 'Asian', image: 'https://picsum.photos/id/433/400/600' },
  { id: 'model-6', name: 'Isabella', ethnicity: 'American Indian', image: 'https://picsum.photos/id/1020/400/600' },
];

export const MODEL_OPTIONS = {
  ethnicities: ['White', 'Black', 'Asian', 'American Indian', 'Indian', 'Hispanic'],
  bodyTypes: ['Slim', 'Athletic', 'Mature', 'Plus-size', 'Petite'],
  hairstyles: ['Afro', 'Straight Long', 'Wavy Short', 'Shaved', 'Braids', 'Curly Bob'],
  ages: ['Teens', '20s', '30s', '40s', '50s+'],
  skinTones: ['Fair', 'Olive', 'Medium', 'Brown', 'Deep'],
};

export const STYLING_OPTIONS = {
  fits: ['Savile Row Tailoring', 'Neapolitan Soft Tailoring', 'American Natural Cut', 'Modern Casual'],
  styles: ['Summer Streetwear', 'Luxury Formalwear', 'Classic Menswear', 'Avant-Garde', 'Minimalist'],
  brands: ['Luxury', 'Streetwear', 'Classic', 'Avant-Garde', 'Sustainable'],
};

export const PRE_BUILT_BACKGROUNDS = [
  { id: 'urban', name: 'Urban Street', image: 'https://picsum.photos/seed/urban-bg/400/600' },
  { id: 'interior', name: 'Modern Interior', image: 'https://picsum.photos/seed/interior-bg/400/600' },
  { id: 'nature', name: 'Lush Forest', image: 'https://picsum.photos/seed/nature-bg/400/600' },
  { id: 'beach', name: 'Tropical Beach', image: 'https://picsum.photos/seed/beach-bg/400/600' },
  { id: 'industrial', name: 'Warehouse Loft', image: 'https://picsum.photos/seed/industrial-bg/400/600' },
  { id: 'neon', name: 'Neon City', image: 'https://picsum.photos/seed/neon-bg/400/600' },
  { id: 'desert', name: 'Vast Desert', image: 'https://picsum.photos/seed/desert-bg/400/600' },
  { id: 'studio', name: 'Minimalist Studio', image: 'https://picsum.photos/seed/studio-bg/400/600' },
  { id: 'rooftop', name: 'City Rooftop', image: 'https://picsum.photos/seed/rooftop-bg/400/600' },
  { id: 'cafe', name: 'Cozy Cafe', image: 'https://picsum.photos/seed/cafe-bg/400/600' },
  { id: 'cyberpunk', name: 'Cyberpunk Alley', image: 'https://picsum.photos/seed/cyberpunk-bg/400/600' },
];

export const PHOTOGRAPHY_OPTIONS = {
  cameras: ['Leica', 'Fuji', 'Canon', 'Sony', 'Medium-Format Film'],
  lenses: ['Fixed 50mm', 'Zoom 24-70mm', 'Vintage 35mm', 'Wide 16mm'],
  looks: ['Editorial', 'Candid', 'Filmic', 'Sharp Digital', 'Soft Focus'],
  lightings: ['Golden Hour', 'Studio Flash', 'Ambient Indoor', 'Night Neon', 'Overcast Day'],
  moods: ['Editorial', 'Campaign', 'E-commerce', 'Social Content', 'Candid'],
  aspectRatios: [
    { name: 'Portrait', value: '3:4' as const },
    { name: 'Square', value: '1:1' as const },
    { name: 'Social', value: '9:16' as const },
    { name: 'Cinematic', value: '16:9' as const },
  ],
};

export const INSPIRATION_GALLERY_ITEMS: InspirationItem[] = [
  {
    id: 'tokyo-street',
    title: 'Tokyo Street',
    description: 'Neon-lit night scene with edgy, layered fashion.',
    image: 'https://picsum.photos/seed/tokyo-street/400/600',
    config: {
      stylingConfig: {
        style: 'Avant-Garde',
        styleDescription: 'Layered techwear with oversized silhouettes, reflective materials, and tactical accessories. Inspired by Harajuku street fashion.',
        brand: 'Streetwear',
      },
      photographyConfig: {
        lighting: 'Night Neon',
        backgroundType: 'description',
        backgroundDescription: 'A rain-slicked alley in Shinjuku, Tokyo, with glowing neon signs reflecting on the puddles.',
        mood: 'Candid',
        look: 'Filmic',
        camera: 'Sony',
        lens: 'Vintage 35mm',
        aspectRatio: '3:4',
      },
    },
  },
  {
    id: 'italian-riviera',
    title: 'Italian Riviera',
    description: 'Sun-drenched coastal vibes with relaxed, elegant linen.',
    image: 'https://picsum.photos/seed/riviera-style/400/600',
    config: {
      stylingConfig: {
        fit: 'Modern Casual',
        style: 'Summer Streetwear',
        styleDescription: 'A relaxed, off-white linen shirt, unbuttoned slightly, paired with tailored navy blue chino shorts. Brown leather boat shoes and classic wayfarer sunglasses.',
        brand: 'Luxury',
      },
      photographyConfig: {
        lighting: 'Golden Hour',
        backgroundType: 'pre-built',
        preBuiltBackgroundId: 'beach',
        backgroundDescription: '',
        mood: 'Candid',
        look: 'Editorial',
        camera: 'Leica',
        lens: 'Fixed 50mm',
        aspectRatio: '1:1',
      },
    },
  },
   {
    id: 'film-noir',
    title: 'Film Noir',
    description: 'High-contrast, black and white mystery with classic tailoring.',
    image: 'https://picsum.photos/seed/film-noir/400/600',
    config: {
       stylingConfig: {
        fit: 'Savile Row Tailoring',
        style: 'Classic Menswear',
        styleDescription: 'A classic double-breasted trench coat over a sharp suit. The model is holding a fedora. The entire scene is black and white.',
        brand: 'Classic',
      },
      photographyConfig: {
        lighting: 'Overcast Day',
        backgroundType: 'description',
        backgroundDescription: 'A foggy, dimly lit street corner at dusk, with long shadows cast from a single streetlamp.',
        mood: 'Campaign',
        look: 'Filmic',
        camera: 'Medium-Format Film',
        lens: 'Vintage 35mm',
        aspectRatio: '16:9',
      },
    },
  },
   {
    id: 'ecommerce-studio',
    title: 'E-commerce',
    description: 'Clean, minimalist studio shot with sharp, commercial focus.',
    image: 'https://picsum.photos/seed/e-commerce/400/600',
    config: {
      stylingConfig: {
        style: 'Minimalist',
        styleDescription: 'A simple, well-fitting heather grey t-shirt and dark wash denim jeans.',
        brand: 'Classic',
      },
      photographyConfig: {
        lighting: 'Studio Flash',
        backgroundType: 'description',
        backgroundDescription: 'A seamless, neutral light-grey background.',
        mood: 'E-commerce',
        look: 'Sharp Digital',
        camera: 'Canon',
        lens: 'Zoom 24-70mm',
        aspectRatio: '9:16',
      },
    },
  },
];