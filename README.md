# WalkThru AI — Virtual Real Estate Walkthrough Generator

Convert property images into smooth, cinematic virtual walkthrough videos using Google Gemini AI and Veo 3.1.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white)

---

## Features

- **One-Click Upload** — Drag & drop or browse to upload a property image (JPG, PNG, WebP)
- **AI Image Analysis** — Gemini 2.5 Flash analyzes architectural details, lighting, layout, and design
- **Auto-Generated Prompts** — AI crafts a cinematic walkthrough description tailored to your property
- **Editable Prompts** — Review and customize the walkthrough prompt before generating
- **Video Generation** — Veo 3.1 produces a smooth, 16:9 cinematic walkthrough video
- **Preview & Download** — Watch the result in-browser and download as MP4
- **Responsive Design** — Works on desktop and mobile devices

## How It Works

1. **Upload** — Drop in a photo of any property (exterior or interior)
2. **Analyze** — Gemini AI examines the image and generates a cinematic walkthrough prompt
3. **Generate** — Veo 3.1 creates a professional walkthrough video from the prompt + image
4. **Download** — Preview the video and download it instantly

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Google Gemini 2.5 Flash | Image analysis & prompt generation |
| Google Veo 3.1 | AI video generation |
| React Router | Client-side routing |
| React Dropzone | File upload handling |
| Lucide React | Icons |
| CSS Modules | Scoped component styling |

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key with access to Veo 3.1

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/walkthru-ai.git
cd walkthru-ai

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Top navigation bar
│   ├── Navbar.module.css
│   ├── LandingPage.jsx         # Hero, features, CTA sections
│   ├── LandingPage.module.css
│   ├── GeneratorPage.jsx       # Core 4-step generator flow
│   └── GeneratorPage.module.css
├── services/
│   └── gemini.js               # Gemini AI & Veo API integration
├── App.jsx                     # Route definitions
├── main.jsx                    # App entry point
└── index.css                   # Global styles & CSS variables
```

## API Usage

This app uses two Google AI models:

- **Gemini 2.5 Flash** — Analyzes the uploaded image and generates a descriptive walkthrough prompt
- **Veo 3.1** (`veo-3.1-generate-preview`) — Generates the walkthrough video from the prompt and reference image

Video generation typically takes **2–5 minutes**. The app polls the operation status every 10 seconds until complete.

## License

MIT
