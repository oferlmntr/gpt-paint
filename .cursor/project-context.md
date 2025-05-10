# GPT Power-Ups Project Context

## Project Overview

GPT Power-Ups is a browser extension that enhances ChatGPT conversations with features like a drawing tool and an RTL toggle for right-to-left language support. The extension injects UI components into the ChatGPT webpage.

## Key Features

1. **Drawing Tool**: A MS Paint-like interface allowing users to:
   - Draw with customizable brush sizes and colors
   - Erase portions of drawings
   - Upload and manipulate images
   - Share drawings directly in ChatGPT conversations

2. **RTL Toggle**: A button to convert the direction and alignment of the last assistant message to RTL (right-to-left), useful for languages like Arabic, Hebrew, etc.

## Project Structure

- **src/**: Main source code
  - **components/**: React components
    - **DrawingPanel.tsx**: Main panel that contains the canvas and toolbar
    - **Canvas.tsx**: Drawing canvas implementation
    - **Toolbar.tsx**: Tools interface for drawing features
    - **ColorPicker.tsx**: Color selection component
    - **BrushSizeSelector.tsx**: Brush size selection UI
    - **FloatingButton.tsx**: Button that triggers the drawing panel
  - **context/**: React context for state management
    - **DrawingContext.tsx**: Provides drawing state and methods to components
  - **hooks/**: Custom React hooks
    - **useDraggable.ts**: Hook for making elements draggable
    - **useResizable.ts**: Hook for making elements resizable
  - **types/**: TypeScript definitions
    - **chrome.d.ts**: Chrome extension API type definitions
  - **utils/**: Utility functions
  - **App.tsx**: Root app component
  - **contentScript.tsx**: Main extension injection script
  - **popup.tsx**: Extension popup UI
  - **main.tsx**: Entry point for the React app
  - **extension.css**: Styles for the extension

## Key Components & Patterns

### State Management
The application uses React Context (DrawingContext) to manage drawing state:
- Canvas reference
- Brush properties (size, color)
- Drawing mode (brush/eraser)
- Drawing state (active/inactive)

### Extension Integration
- **Content Script**: Injects React components into ChatGPT page
- **Message Passing**: Uses Chrome messaging API to communicate between popup and content script

### UI Features
- **Draggable Panel**: Drawing panel can be moved around the page
- **Resizable Panel**: Panel can be resized for better drawing experience
- **Image Handling**: Support for uploading, pasting, and dropping images

## Development Notes

- The project uses Tailwind CSS for styling
- Components follow a functional approach with hooks
- The extension is built with Vite
- TypeScript is used throughout for type safety

## Technical Requirements

### Chrome Extension Requirements
- Must properly inject content script for ChatGPT website
- Must handle removal and cleanup when navigating away

### Drawing Tool Requirements
- Canvas must properly scale and handle window resizing
- Drawing actions must be performant
- Must support various input methods (mouse, paste, drag & drop)

### Integration Requirements
- Must properly insert drawings into ChatGPT's input mechanism
- Must not interfere with ChatGPT's normal functionality

## Project Conventions

### Code Style
- Functional React components with hooks
- TypeScript for type safety
- 2-space indentation
- Descriptive variable and function names

### Component Structure
- Props interfaces defined at the top of component files
- Event handlers defined within components
- Components should be modular and reusable when possible

### State Management Guidelines
- Use context for shared state
- Use local state for component-specific state
- Avoid prop drilling

## Build & Development

- `npm run dev`: Development mode
- `npm run build`: Production build
- `npm run build:extension`: Build extension package
- `npm run dev:extension`: Development mode with extension watcher

## Extension Packaging

The extension requires:
- manifest.json
- icons
- compiled assets

## Known Issues & Future Improvements

- Add more drawing tools (shapes, text)
- Improve image manipulation capabilities
- Add more customization options
- Enhance RTL functionality with more language support 