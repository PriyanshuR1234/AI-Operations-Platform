# AI Operations Platform

A modern, scalable Node.js web application integrating Google's **Gemini 2.5 Flash API** to automate operational workflows, from intelligent product cataloging to generating sustainable B2B business proposals. This project features a state-of-the-art **Glassmorphism UI** tailored for high-end professional users. 

Currently, the platform hosts two fully functional AI Modules designed to increase productivity and maintain structured, scalable databases using native AI JSON parsing.

---

## 🚀 Modules Included

### **Module 1: AI Auto-Category & Tag Generator**
This module streamlines digital cataloging. Instead of manually inspecting products to guess their categories and properties, users simply upload an image.
* **Auto-assigns primary categories** directly from a strict internal `taxonomy.json` list.
* **Suggests Sub-categories**, helping classify the product uniquely.
* **Generates 5-10 SEO Tags**, optimizing the product for search engine visibility.
* **Suggests Sustainability Filters** (e.g., plastic-free, vegan) based on visual assessment.
* **Impact:** Reduces catalog entry time by over 90%, entirely preventing human tagging inconsistencies by forcing AI constraints onto strict taxonomy lists.

  <img width="1467" height="868" alt="Screenshot 2026-03-04 at 10 30 25 PM" src="https://github.com/user-attachments/assets/ad73b3ed-0288-4bd8-93b1-7bfb41ef548e" />



### **Module 2: AI B2B Proposal Generator**
Designed for senior employees and sales leaders, this module automates the generation of complex, sustainable B2B business proposals using natural language inputs.
* **Voice-to-Text Input:** Features a built-in microphone button (using the Web Speech API) allowing users to easily dictate proposal overviews entirely hands-free instead of typing typing long paragraphs.
* **Editable UI:** Although the AI generates fully structured data, users have complete control to manually edit the resulting tables and text areas directly within the browser interface.
* **Print Facility:** A dedicated "Print Official Proposal" button applies custom `@print` CSS styling to hide all forms, backgrounds, and buttons, generating a clean, strictly-formatted PDF ready for senior presentation.
* **Suggested Sustainable Product Mix:** AI outlines recommended products along with impact reasoning.
* **Budget Allocation Calculator:** Analyzes the target budget and algorithmically assigns realistic percentages across various categories.
* **Cost & Impact Breakdown:** Evaluates itemized costs and writes an executive pitch focused on the proposal's environmental/sustainable benefits.
* **Impact:** Eliminates the need for tedious manual proposal drafting. Senior staff can instantly build structured, editable proposal drafts, adjust them quickly via UI, and print them immediately to PDF.

---

<img width="1466" height="820" alt="Screenshot 2026-03-04 at 10 32 27 PM" src="https://github.com/user-attachments/assets/5ab75768-6459-484d-acdf-51c7986aa517" />
<img width="1465" height="824" alt="Screenshot 2026-03-04 at 10 32 53 PM" src="https://github.com/user-attachments/assets/d6d83626-6823-4ca2-8678-80ff0e678e90" />



## 🏗 System Architecture

* **Frontend:** Built natively using EJS templating. It leverages clean HTML/CSS with premium aesthetics (variables, animations, backdrop-filters). Interactions are handled in Vanilla JavaScript (e.g., implementing the Web Speech API for voice-to-text functionality).
* **Backend:** Express.js (Node.js framework). It handles routing and safely processes multi-part form data uploads using `multer`. 
* **AI Integration:** Seamlessly talks to Google's `@google/genai` library (Gemini 2.5 Flash models).
* **Data Flow:** The backend builds specialized prompts alongside user data/images, securely pings Gemini for generation, strips out all markdown blocks, parses the raw JSON safely, and directly renders it back onto the EJS views.

---

## 🤖 Prompts Utilized

The core strength of the application lies in how it commands the AI. The following are the constrained prompts we use to ensure perfectly structured JSON outputs:

### **Module 1 Prompt (Image Tagging)**
```text
You are an AI tagging assistant. Analyze the image and assign properties based *only* on the taxonomy list provided below.
Taxonomy:
{ ... dynamic JSON taxonomy list ... }

Return ONLY a raw JSON mapping with the following format, with NO markdown formatting, NO backticks:
{
  "primaryCategory": "...",
  "subCategory": "...",
  "seoTags": ["...", "..."],
  "sustainabilityFilters": ["...", "..."]
}
Make sure your answer is strictly parsable JSON.
```

### **Module 2 Prompt (B2B Proposal)**
```text
You are an expert B2B Sustainable Operations consultant. Generate an AI B2B Proposal based on the following user request.
User Request: " { ... user's spoken or typed prompt ... } "
Budget Constraint: " { ... target budget ... } "

Return ONLY a raw JSON strictly matching this format, with NO markdown formatting, NO backticks:
{
  "productMix": [{"item": "...", "reasoning": "..."}],
  "budgetAllocation": [{"category": "...", "amount": "...", "percentage": "..."}],
  "costBreakdown": [{"item": "...", "cost": "..."}],
  "impactPositioning": "..."
}
Make sure your answer is strictly parsable JSON.
```

---

## ⚙️ How to Run & Use the Application

### 1. Requirements
* Node.js (v18+)
* A Google Gemini API Key. (Get it from Google AI Studio)

### 2. Setup
1. Clone or download the repository.
2. Install packages via terminal:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your API credentials:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

### 3. Starting the Server
Start the development server using:
```bash
nodemon index.js
# OR
npm run local
```

### 4. Using the Platform
1. Open your browser and navigate to `http://localhost:3000`. 
2. **Dashboard:** You will see the main operations board with available Modules.
3. **Module 1:** Click **"Launch Generator"** on the first module. Upload an image to test the auto-tagging. The result will display all inferred JSON fields interactively.
4. **Module 2:** Navigate to the **B2B Proposal Generator**. 
   * Speak into the provided microphone button or type a prompt directly (e.g., *"We need eco-packaging for a coffee brand"*).
   * Specify a budget (e.g., *"1000 dollars"*). 
   * Hit "Generate" – the AI will map the proposal fields. You can then edit any field straight from the frontend UI and hit **"Print Official Proposal"** to save it as a PDF.
5. **Terminal Logging**: As you interact, cleanly formatted JSON logs representing the AI's exact dataset will print within your terminal console natively.
