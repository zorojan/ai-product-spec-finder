
# AI Product Spec Finder

This web application allows users to find detailed product specifications by entering a product's name, model, or article number. It leverages the power of Google's Gemini AI model to perform a real-time web search and extract structured data.

The application operates in two modes: **Single Query** and **Bulk Processing**.

## How It Works

The application's core logic revolves around a sophisticated interaction with the Gemini AI, which acts as an intelligent data retrieval and processing engine.

1.  **User Input**: The user provides a search query.
    -   **Single Query Mode**: Enter a single product name into the search bar.
    -   **Bulk Processing Mode**: Paste a list of products into the text area. The input can be a **JSON array of strings** (e.g., `["iPhone 15 Pro", "Sony WH-1000XM5"]`) or a **plain text list** with one product per line.
2.  **API Request**: The frontend sends this query (or queries) to the Gemini API. The request specifically instructs the `gemini-2.5-flash` model to use its `googleSearch` tool.
3.  **AI-Powered Search & Analysis**: The Gemini model performs a Google Search for each query. It analyzes the top search results to find relevant product information, such as brand, model number, technical specifications, and descriptions.
4.  **Structured Data Extraction**: The prompt given to the AI includes a strict JSON schema. The model is commanded to parse the information it gathered from the web and format it into this JSON structure. This step is crucial for transforming unstructured web content into clean, usable data.
5.  **Response and Grounding**: The API returns the generated JSON object containing the product details. Crucially, it also provides `groundingMetadata`—a list of the web pages it used as sources for its information.
6.  **UI Rendering and Export**:
    -   In single mode, a product card is displayed.
    -   In bulk mode, a results table is populated. Once processing is complete, you can **download the entire dataset as a JSON or CSV file**, providing an API-like experience for data retrieval.

## Data Sources

The primary and sole data source for this application is **Google Search**.

-   The application **does not** connect directly to any specific product databases like GS1 or Icecat.
-   Instead, it relies on the Gemini model's ability to find, read, and synthesize information from any publicly available website indexed by Google Search. This could include manufacturer websites, retail stores, review sites, and news articles.
-   This approach ensures that the information is as up-to-date as Google's search index.

## Project Structure

-   `index.html`: The main entry point of the application.
-   `index.tsx`: Mounts the React application.
-   `App.tsx`: The root React component, managing state and orchestrating the UI.
-   `services/geminiService.ts`: Handles all communication with the Google Gemini API.
-   `components/`: Contains all reusable React components.
-   `utils/`: Contains utility functions, such as data export helpers.
-   `types.ts`: Defines shared TypeScript types and interfaces.
