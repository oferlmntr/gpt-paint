<div align="center">
  <!-- Note: Create a logo and place in screenshots/gpt-paint-logo.png -->
  <img src="screenshots/gpt-paint-logo.png" alt="GPT Paint Logo" width="150" />
  
  # GPT Paint
  
  🎨 Draw directly in ChatGPT conversations with this browser extension 🖌️
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
  [![Issues](https://img.shields.io/github/issues/oferlmntr/gpt-paint.svg)](https://github.com/oferlmntr/gpt-paint/issues)
  
  [Installation](#installation) • 
  [Features](#features) • 
  [Contributing](./CONTRIBUTING.md) • 
  [Documentation](#usage)
</div>

<div align="center">
  <a href="https://github.com/oferlmntr/gpt-paint/raw/main/screenshots/gpt-camel.mp4">
    <img src="https://img.shields.io/badge/▶️-Watch%20Demo%20Video-blue?style=for-the-badge&logo=github" alt="Watch Demo Video" />
  </a>
</div>

## Features

- Simple drawing interface with brush and eraser tools
- Color selection with multiple preset colors
- Adjustable brush sizes
- Image upload and clipboard paste support
- Selection tool for moving parts of your drawing
- Easy sharing directly to ChatGPT conversations
- Downloadable PNG exports
- Copy to clipboard functionality
- Draggable panel interface

## Installation

### Chrome Web Store
_Coming soon_

### Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/oferlmntr/gpt-paint.git
   cd gpt-paint
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Usage

1. Navigate to ChatGPT (https://chat.openai.com)
2. Click the brush icon that appears on the page
3. Use the drawing tools to create your image
4. When finished, click "Send to ChatGPT" to insert your drawing into the conversation

### Drawing Tools

- **Brush Tool**: Draw freehand on the canvas
- **Eraser Tool**: Remove parts of your drawing
- **Upload**: Add images from your device
- **Colors**: Choose from preset colors
- **Brush Size**: Select different brush thicknesses
- **Clear**: Reset the canvas
- **Copy**: Copy the drawing to clipboard
- **Download**: Save as PNG file
- **Send**: Add the drawing to your ChatGPT conversation

## Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Setup Development Environment

1. Clone the repository
   ```bash
   git clone https://github.com/oferlmntr/gpt-paint.git
   cd gpt-paint
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## Contributing

Contributions are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

Before submitting a pull request, please make sure your changes follow our coding standards and have been tested thoroughly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built with TypeScript and modern browser APIs
- Icons from various open source icon libraries
- Special thanks to all contributors

---

Made with ❤️ by [oferlmntr](https://github.com/oferlmntr) 