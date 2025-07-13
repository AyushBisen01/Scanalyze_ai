# RadioAgent: AI-Powered Radiological Analysis

RadioAgent is an advanced clinical decision support system designed to assist radiologists and healthcare professionals. Built with Next.js, Firebase Studio, and Google's Genkit, this application leverages generative AI to analyze medical images (X-rays, CT scans, MRIs, ultrasounds), generate detailed diagnostic reports, and provide interactive insights.

## Key Features

- **Multi-Image/Video Upload**: Upload and analyze a series of medical images or videos (like ultrasounds) in a single session.
- **AI-Powered Analysis**: Get instant insights with AI-generated key findings and a list of detected anomalies.
- **Explainable AI (XAI)**: Visualize the areas of an image that the AI focused on to reach its conclusions, providing transparency and building trust.
- **Detailed PDF Reports**: Generate and download comprehensive, professionally formatted diagnostic reports, including patient information and key images.
- **Symptom & Anomaly Correlation**: Input patient symptoms to receive a differential diagnosis that correlates clinical signs with imaging findings.
- **Conversational Assistant**: Ask follow-up questions about the analysis in a natural, conversational way to get deeper insights.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI/ML**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Firebase App Hosting

## Getting Started

To run this project locally, you will need to set up your environment with a Google AI API key.

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 3. Environment Variables

You need a Google AI API key to use the generative AI features.

1.  Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a file named `.env` in the root of the project.
3.  Add your API key to the `.env` file:

    ```
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

### 4. Running the Application

This project requires running two processes concurrently: the Next.js development server and the Genkit development server.

1.  **Start the Genkit Server**:
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit flows and will automatically restart when you make changes to files in `src/ai/`.

2.  **Start the Next.js App**:
    Open a second terminal and run:
    ```bash
    npm run dev
    ```
    This starts the Next.js application, which you can access at [http://localhost:9002](http://localhost:9002).
