# ChatGPT Drawing Tool Chrome Extension

A Chrome extension that adds a convenient drawing tool to ChatGPT, allowing you to create and share drawings directly in your conversations.

## Features

- Floating paint-style drawing tool for ChatGPT
- Brush and eraser tools with adjustable sizes
- Color picker for custom colors
- Image upload capability
- Ability to paste images from clipboard
- Copy drawings to clipboard
- Send drawings directly to ChatGPT
- Download drawings as PNG files
- Resizable and draggable interface

## Installation Instructions

### Option 1: Install from Chrome Web Store

*Coming soon*

### Option 2: Install as an unpacked extension

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/chatgpt-drawing-tool.git
   cd chatgpt-drawing-tool
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npm run build:extension
   ```

4. Create icon files in the `dist/icons` directory:
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)

5. Open Chrome and navigate to `chrome://extensions/`

6. Enable "Developer mode" using the toggle in the top-right corner

7. Click "Load unpacked" and select the `dist` folder from this project

8. The extension should now appear in your extensions list

## Usage

1. Navigate to [ChatGPT](https://chat.openai.com/)

2. Click the brush icon in the bottom-right corner of the page to open the drawing tool

3. Alternatively, click the extension icon in the Chrome toolbar and click "Open Drawing Tool"

4. Use the brush tool to draw, the eraser to remove parts of your drawing

5. Adjust brush size and color as needed

6. When finished, you can:
   - Copy the drawing to your clipboard
   - Download the drawing as a PNG
   - Send the drawing directly to the ChatGPT conversation

## Development

1. Clone this repository
   ```
   git clone https://github.com/yourusername/chatgpt-drawing-tool.git
   cd chatgpt-drawing-tool
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. For extension development, build and update the extension
   ```
   npm run build:extension
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide](https://lucide.dev/)
- Built with React, TypeScript, and Vite 