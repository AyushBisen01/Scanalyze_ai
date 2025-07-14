
# RadioAgent 🩺: AI-Powered Radiological Analysis

**RadioAgent** is an advanced clinical decision support system designed to empower radiologists and healthcare professionals. Built with Next.js and Google's Genkit, this application leverages cutting-edge generative AI to analyze medical images (X-rays, CT scans, MRIs), generate detailed diagnostic reports, and provide interactive, explainable insights to improve patient outcomes.

---

## ✨ Key Features

- **Multi-Modal Upload**: Seamlessly upload and analyze a series of medical images (X-ray, CT, MRI) or videos (ultrasound) in a single session.
- **🚀 Instant AI Analysis**: Receive immediate AI-generated key findings and a prioritized list of detected anomalies, accelerating the diagnostic process.
- **💡 Explainable AI (XAI)**: Visualize the areas of an image the AI focused on to reach its conclusions. This transparency builds trust and allows for clinical validation of the AI's reasoning.
- **📋 Comprehensive PDF Reports**: Generate and download detailed, professionally formatted diagnostic reports complete with patient information, key images, and AI findings.
- **🔬 Symptom & Finding Correlation**: Input patient symptoms to receive a differential diagnosis that correlates clinical signs with imaging findings, enhancing diagnostic accuracy.
- **🤖 Conversational Assistant**: Engage with an AI assistant to ask follow-up questions, clarify findings, or explore differential diagnoses in a natural, conversational way.

---

## Workflow

1.  **Upload**: Start by uploading one or more medical images or videos.
2.  **Analyze**: The AI analyzes the entire series, identifying key findings and anomalies.
3.  **Review**: An initial report is generated. You can dive deeper with:
    *   **Explainable AI**: See heatmaps showing what the AI focused on.
    *   **Symptom Correlator**: Add clinical symptoms for a differential diagnosis.
    *   **Conversational AI**: Ask clarifying questions.
4.  **Download**: Generate and download a comprehensive PDF report with all the details.

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Genkit-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Genkit"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/ShadCN_UI-000000?style=for-the-badge&logo=shadcn-ui&logoColor=white" alt="ShadCN UI"/>
</p>

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI/ML**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Firebase App Hosting

---

## 🚀 Getting Started

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
