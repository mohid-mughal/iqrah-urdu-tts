# Iqrah - Urdu TTS

A web-based text-to-speech application for Urdu language with voice cloning capabilities.

## Features

- Two fine-tuned SpeechT5 models (Standard and Phoneme-based)
- Voice cloning with reference audio upload or microphone recording
- Roman Urdu to Urdu script transliteration
- Pakistan-inspired design with cultural elements
- Responsive design for mobile and desktop
- Analytics tracking with Vercel Analytics

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with new concurrent features
- **TypeScript** for type safety
- **Tailwind CSS** for styling with Pakistan-themed design tokens
- **Vercel Analytics v2** for usage tracking
- **fast-check** for property-based testing
- **Jest** + **React Testing Library** for unit testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
iqrah-urdu-tts/
├── app/              # Next.js App Router pages
├── components/       # React components
├── services/         # Service classes (TTS, Recording, Analytics)
├── utils/            # Utility functions
└── __tests__/        # Test files
```

## Models

### Standard Model
- Trained on 17,000 samples
- No phoneme processing
- Endpoint: `https://ahmedjaved812-urdu-tts-backend.hf.space/synthesize`

### Phoneme Model (Experimental)
- Trained on 120,000 samples
- Word-based phonemization (experimental)
- Endpoint: `https://ahmedjaved812-urdu-tts-phonemes-backend.hf.space/synthesize`

## Deployment

This project is configured for automatic deployment to Vercel via GitHub integration.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Your app will be deployed at `https://your-project.vercel.app`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

- Backend APIs hosted on Hugging Face Spaces
- Developed by Mohid Mughal and Ahmed Javed
- NUST (National University of Sciences and Technology)

## License

MIT
